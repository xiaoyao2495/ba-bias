import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {planRetention,applyRetention,verifyRetention} from '../src/storage/retention.js';
export async function retentionCommand(args){
 const [mode,...rest]=args;if(!['AUDIT','DRY_RUN','APPLY','VERIFY'].includes(mode))throw Error('EXPLICIT_RETENTION_MODE_REQUIRED');
 const options={};for(let i=0;i<rest.length;i++){const key=rest[i];if(['--root','--plan','--confirm','--max-runs'].includes(key)&&rest[i+1]&&!rest[i+1].startsWith('--'))options[key.slice(2)]=rest[++i];else throw Error('INVALID_RETENTION_ARGUMENT');}
 if(!options.root)throw Error('EXPLICIT_RETENTION_ROOT_REQUIRED');
 if(mode==='VERIFY')return verifyRetention(options.root);
 if(mode==='APPLY'){if(options.confirm!=='DELETE_EXPIRED_RUNS')throw Error('RETENTION_EXPLICIT_CONFIRMATION_REQUIRED');let plan=null;if(options.plan){if((await fs.stat(options.plan)).size>16*1024*1024)throw Error('RETENTION_PLAN_TOO_LARGE');plan=JSON.parse(await fs.readFile(options.plan,'utf8'));}return applyRetention(options.root,plan,{enabled:true,confirm:options.confirm,confirmRoot:options.root,maxRuns:options['max-runs']===undefined?3:Number(options['max-runs'])});}
 const p=await planRetention(options.root);return {contract:p.contract,root:p.root,evaluatedAt:p.evaluatedAt,planId:p.planId,metrics:p.metrics,issues:p.issues,units:p.units.map(({files,researchIds,...u})=>({...u,fileCount:files.length,researchIds}))};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)retentionCommand(process.argv.slice(2)).then(r=>{console.log(JSON.stringify(r,null,2));if(r.ok===false)process.exitCode=1;}).catch(e=>{console.error(JSON.stringify({error:/^[A-Z_]+$/.test(e.message)?e.message:'RETENTION_FAILED',code:e.code||null}));process.exitCode=1;});
