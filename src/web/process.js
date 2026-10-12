import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
const exec=promisify(execFile);
export function classifyProcesses(rows,projectRoot,lockPid){
 const normalized=projectRoot.replaceAll('\\','/').toLowerCase(),entry=normalized+'/src/scan-daemon.js';
 const matches=[],ambiguous=[];
 for(const row of rows){const cmd=String(row.command||'').replaceAll('\\','/').toLowerCase();if(!/(?:^|[\"/\s])node(?:\.exe)?(?=[\"\s]|$)/.test(cmd))continue;if(!/scan-daemon\.js(?:["'\s]|$)/.test(cmd))continue;
  if(cmd.includes(entry)||Number(row.pid)===lockPid)matches.push(Number(row.pid));else ambiguous.push(Number(row.pid));
 }
 return {state:matches.length?'RUNNING':ambiguous.length?'UNKNOWN':'STOPPED',instances:matches.length,pids:matches,ambiguousCount:ambiguous.length,basis:'process command identity; relative command requires matching project run-lock PID'};
}
export async function scannerProcesses(projectRoot,lockPid){
 try{
  let rows;
  if(process.platform==='win32'){
   // Fixed command; request parameters and paths are never interpolated into PowerShell.
   const {stdout}=await exec('powershell.exe',['-NoProfile','-NonInteractive','-Command',"@(Get-CimInstance Win32_Process -Filter \"Name = 'node.exe'\" | Select-Object ProcessId,CommandLine) | ConvertTo-Json -Compress"],{timeout:5000,maxBuffer:1024*1024,windowsHide:true});
   const parsed=JSON.parse(stdout||'[]');rows=(Array.isArray(parsed)?parsed:[parsed]).map(x=>({pid:x.ProcessId,command:x.CommandLine}));
   if(rows.some(x=>!x.command))return {state:'UNKNOWN',instances:null,basis:'PROCESS_COMMAND_PERMISSION_MISSING'};
  }else{
   const {stdout}=await exec('/bin/ps',['-ax','-o','pid=,command='],{timeout:5000,maxBuffer:1024*1024});rows=stdout.split('\n').map(l=>{const m=l.match(/^\s*(\d+)\s+(.*)$/);return m?{pid:Number(m[1]),command:m[2]}:{command:''};});
  }
  return classifyProcesses(rows,path.resolve(projectRoot),lockPid);
 }catch{return {state:'UNKNOWN',instances:null,basis:'PROCESS_INSPECTION_UNAVAILABLE'};}
}
