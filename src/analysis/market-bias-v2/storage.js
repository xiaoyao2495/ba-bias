import fs from 'node:fs/promises';
import path from 'node:path';
import {readJson} from '../../storage/history.js';
import {immutableWrite,v2Dir} from '../../storage/market-bias-v2-state.js';
import {validateResearch} from './parser.js';
import {CONTRACT,sha,fail} from './common.js';
export async function previousResearch(root,history,symbol,cutoff){
 const entries=Object.values(history.research||{}).filter(r=>r.symbol===symbol&&r.executionState==='VALIDATED'&&r.factsAsOf<cutoff).sort((a,b)=>b.factsAsOf-a.factsAsOf);
 const e=entries[0];if(!e)return null;const r=await readJson(path.join(v2Dir(root),'research',e.runId,symbol+'.json'),null);
 if(!r||!validateResearch(r)||r.contract!==CONTRACT||r.recordId!==e.recordId||sha(r)!==e.researchSha256)throw fail('PREVIOUS_RESEARCH_CORRUPT','PERSISTENCE');
 const bytes=await fs.readFile(path.join(root,'runs',e.runId,'facts',symbol+'.json'));if(sha(bytes)!==r.factsPackageSha256)throw fail('PREVIOUS_FACTS_HASH_MISMATCH','PERSISTENCE');return {research:r,facts:JSON.parse(bytes)};
}
export async function saveResearch(root,result,history,{now=Date.now}={}){
 const r=result.research;if(!validateResearch(r))throw fail('RESEARCH_SCHEMA_INVALID','PERSISTENCE');
 const dir=v2Dir(root),file=path.join(dir,'research',r.runId,r.symbol+'.json');
 // Seal the exact input before the result, so a crash after research persistence
 // still leaves enough evidence to finish the receipt and queue without a model call.
 if(result.input)await immutableWrite(path.join(dir,'audit',r.runId,r.symbol+'.json'),{contract:CONTRACT,input:result.input,inputHash:sha(result.input),attempts:result.attempts});
 await immutableWrite(file,r);
 // Receipt is outside the sealed research: persistedAt cannot be known before acknowledgement.
 const receiptFile=path.join(dir,'receipts',r.recordId+'.json');let receipt=await readJson(receiptFile,null);
 if(receipt){if(receipt.researchSha256!==sha(r))throw fail('RECEIPT_HASH_MISMATCH','PERSISTENCE');}
 else {const persistedAt=now();if(r.asOf.validationCompletedAt!==null&&persistedAt<r.asOf.validationCompletedAt)throw fail('PERSISTENCE_CLOCK_ORDER_INVALID','PERSISTENCE');receipt={contract:CONTRACT,recordId:r.recordId,researchSha256:sha(r),persistedAt};await immutableWrite(receiptFile,receipt);}
 history.research[r.recordId]={contract:CONTRACT,recordId:r.recordId,runId:r.runId,symbol:r.symbol,factsAsOf:r.asOf.factsAsOf,executionState:r.executionState,researchFormat:r.researchFormat??null,reviewStatus:r.reviewStatus??null,researchSha256:sha(r)};return {research:r,receipt};
}
