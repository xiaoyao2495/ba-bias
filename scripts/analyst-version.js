// Manual future-run selection. Never scans, sends, rewrites History or replays runs.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {activeAnalyst} from '../src/analysis/active-analyst.js';import {config} from '../src/config.js';
export function selectVersion(version,{file=new URL('../src/analysis/active-analyst.json',import.meta.url),dataDir=config.dataDir}={}){
 if(!['V3','V4'].includes(version))throw Error('INVALID_ANALYST_VERSION');
 if(fs.existsSync(path.join(dataDir,'state','run.lock'))||fs.existsSync(path.join(dataDir,'state','run.lease')))throw Error('STOP_AND_CONFIRM_PRODUCTION_PROCESS_BEFORE_VERSION_CHANGE');
 const temporary=file instanceof URL?fileURLToPath(file)+'.next':file+'.next';fs.writeFileSync(temporary,JSON.stringify({version:1,activeAnalyst:version,automaticFallback:false})+'\n',{flag:'wx'});fs.renameSync(temporary,file);return activeAnalyst(file);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){if(process.argv[2]==='--set')console.log(selectVersion(process.argv[3]));else if(process.argv[2]==='--status')console.log(activeAnalyst());else throw Error('USE_STATUS_OR_SET_EXPLICIT_VERSION');}
