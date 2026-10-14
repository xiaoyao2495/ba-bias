// Offline release identity + data readiness. Read only: no HTTP, Scanner or delivery invocation.
import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
import {config,safeError} from '../src/config.js';import {readiness,SYSTEM,PROMPT_HASH} from '../src/analysis/market-bias-v2/executor.js';import {buildInput} from '../src/analysis/market-bias-v2/input.js';import {sha} from '../src/analysis/market-bias-v2/common.js';import {assertPrepared,v2Dir} from '../src/storage/market-bias-v2-state.js';import {queueEligible} from '../src/storage/delivery-queue.js';
export async function check({data=false}={}){
 if(PROMPT_HASH!=='90b0df5ff5d305a8d2f968b0af7009528519d9dbf10185b19dff18e388ed3aa9'||sha(SYSTEM)!==PROMPT_HASH)throw Error('PROMPT_IDENTITY_MISMATCH');
 const bytes=await fs.readFile(new URL('../test/fixtures/v2-market-researcher/clock/VERIFIED_FACTS.json',import.meta.url)),f=JSON.parse(bytes),input=buildInput(f,{mode:'HISTORICAL_REPLAY',factsPackageSha256:sha(bytes)});
 if(input.projectionVersion!=='V2_ACCOUNT_RATIOS_ONLY_V1'||/topPositions|TOP_TRADER_POSITIONS|topLongPositionShare|topShortPositionShare|topLongShortPositionRatio/.test(JSON.stringify(input)))throw Error('REDUCED_PROJECTION_NOT_ACTIVE');
 let dataReady=null;if(data){await assertPrepared(config.dataDir);const dir=path.join(v2Dir(config.dataDir),'outbox');for(const name of await fs.readdir(dir).catch(e=>{if(e.code==='ENOENT')return [];throw e;})){if(!name.endsWith('.json'))continue;const record=JSON.parse(await fs.readFile(path.join(dir,name),'utf8'));if(queueEligible(record))throw Error('ELIGIBLE_LEGACY_OUTBOX_STOP_SCANNER');}dataReady=true;}
 return {...readiness(),projectionVersion:input.projectionVersion,dryRunFacts:input.currentFacts.length,automaticPublication:false,dataReady};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){if(process.argv.slice(2).some(x=>x!=='--data'))throw Error('INVALID_ARGUMENT');check({data:process.argv.includes('--data')}).then(r=>console.log(JSON.stringify(r))).catch(e=>{console.error(safeError(e));process.exitCode=1;});}
