import {pathToFileURL} from 'node:url';
import {config,safeError} from '../src/config.js';
import {planCutover,initializeV2,checkLegacyIntegrity,assertPrepared} from '../src/storage/market-bias-v2-state.js';
export async function prepare(args){
 if(args[0]==='--research')return research(args.slice(1));if(args.length!==1||!['--plan','--apply','--check'].includes(args[0]))throw Error('EXPLICIT_CUTOVER_OPERATION_REQUIRED');if(args[0]==='--plan'){const p=await planCutover(config.dataDir);return {operation:'PLAN_ONLY',files:Object.keys(p.manifest.legacyHashes).length,legacyRuns:p.manifest.legacyRunIds.length,seedSymbols:Object.keys(p.history.selectorBaseline).length};}if(args[0]==='--check'){await assertPrepared(config.dataDir);return checkLegacyIntegrity(config.dataDir);}const m=await initializeV2(config.dataDir);return {operation:'PREPARED_NOT_STARTED',contract:m.contract,preparedAt:m.preparedAt};}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)prepare(process.argv.slice(2)).then(r=>{console.log(JSON.stringify(r));if(r.ok===false)process.exitCode=1;}).catch(e=>{console.error(safeError(e));process.exitCode=1;});

// Same V2 CLI, explicit execution only; dry-run never creates History or Outbox.
export async function research(args){
 const options={};let dry=false,execute=false;for(let i=0;i<args.length;i++){const k=args[i];if(k==='--dry-run')dry=true;else if(k==='--execute')execute=true;else if(['--symbol','--from-snapshot','--mode'].includes(k)&&args[i+1])options[k.slice(2)]=args[++i];else throw Error('INVALID_RESEARCH_ARGUMENT');}
 if(dry===execute||!options.symbol||!options['from-snapshot']||!['LIVE','HISTORICAL_REPLAY'].includes(options.mode))throw Error('EXPLICIT_RESEARCH_MODE_AND_OPERATION_REQUIRED');
 const fs=await import('node:fs/promises'),path=await import('node:path');
 const bytes=await fs.readFile(options['from-snapshot']),f=JSON.parse(bytes);if(f.symbol!==options.symbol)throw Error('SNAPSHOT_SYMBOL_MISMATCH');
 const {buildInput}=await import('../src/analysis/market-bias-v2/input.js'),{sha}=await import('../src/analysis/market-bias-v2/common.js'),{analyze,createAdapter,PROMPT_HASH}=await import('../src/analysis/market-bias-v2/executor.js');
 const input=buildInput(f,{mode:options.mode,factsPackageSha256:sha(bytes)});
 if(options.mode==='LIVE'&&(input.factsCollectedAt===null||Date.now()-input.factsCollectedAt>config.maxSnapshotAgeMinutes*60000))throw Error('SNAPSHOT_STALE');
 if(dry)return {operation:'DRY_RUN_NO_MODEL_NO_WRITES',symbol:f.symbol,mode:input.mode,contextId:input.contextId,factsHash:sha(bytes),promptHash:PROMPT_HASH,factCount:input.currentFacts.length,excludedFacts:input.excludedFacts};
 const {saveResearch}=await import('../src/analysis/market-bias-v2/storage.js'),{immutableWrite,v2Dir}=await import('../src/storage/market-bias-v2-state.js'),{atomicWrite,lock,readJson}=await import('../src/storage/history.js');
 const release=await lock(config.dataDir);try{const {history}=await assertPrepared(config.dataDir);if(await readJson(path.join(v2Dir(config.dataDir),'research',f.runId,f.symbol+'.json'),null))throw Error('RESEARCH_ALREADY_SEALED');const result=await analyze(createAdapter(),f,{mode:options.mode,factsPackageSha256:sha(bytes)});
 const archive=path.join(config.dataDir,'runs',f.runId,'facts',f.symbol+'.json');await fs.mkdir(path.dirname(archive),{recursive:true});try{await fs.writeFile(archive,bytes,{flag:'wx'});}catch(e){if(e.code!=='EEXIST'||sha(await fs.readFile(archive))!==sha(bytes))throw Error('SNAPSHOT_ARCHIVE_COLLISION');}await saveResearch(config.dataDir,result,history);await atomicWrite(path.join(v2Dir(config.dataDir),'state','history.json'),history);return {operation:'RESEARCH_SAVED_MANUAL_REVIEW_REQUIRED',recordId:result.research.recordId,state:result.research.executionState};}finally{await release();}
}
