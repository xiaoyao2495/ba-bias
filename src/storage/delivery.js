import crypto from 'node:crypto';
import {setTimeout as pause} from 'node:timers/promises';
import {safeError} from '../config.js';
import {sendNotification} from '../clients/dingtalk.js';
const inFlight=new Set();
export const deliveryId=record=>'delivery_'+crypto.createHash('sha256').update([record.runId,record.symbol,record.storyKey].join('\0')).digest('hex').slice(0,32);
export function deliveryFailure(error){
  const code=error.code,status=error.httpStatus ?? error.response?.status;
  const definite=error.definiteFailure || [400,401,403,404,413,429].includes(status) || ['ENOTFOUND','EAI_AGAIN','ECONNREFUSED'].includes(code);
  return {status:definite?'FAILED':'UNKNOWN',error:safeError(error),businessCode:error.businessCode ?? null,httpStatus:status ?? null,
    retryable:error.retryable || status===429 || ['EAI_AGAIN','ECONNREFUSED'].includes(code),retryAfterMs:Math.min(30000,Math.max(1000,error.retryAfterMs || 1000))};
}
export async function deliverNewArticle(record,facts,{send=false,persist,runId,minimumGeneratedAt=0,http,signal,now=Date.now,sleep=pause,notifier=sendNotification}={}){
  const id=record.delivery?.deliveryId || deliveryId(record);
  if(!send || record.runId!==runId || record.generatedAt<minimumGeneratedAt || !record.approval?.judgeEligible || !record.approval?.claimGuardPassed)return record.delivery;
  if(['SENT','SENDING','UNKNOWN','SHADOW','ATTEMPTED_UNKNOWN','FAILED_OR_UNKNOWN'].includes(record.delivery?.status) || inFlight.has(id))return record.delivery;
  if(record.delivery?.attempts>=2)return record.delivery;
  inFlight.add(id);
  try{
    record.delivery={...record.delivery,deliveryId:id,status:'PENDING',sent:false,attempts:record.delivery?.attempts || 0};await persist(record);
    while(record.delivery.attempts<2){
      // Durably reserve before I/O. A crash leaves SENDING and is recovered as UNKNOWN.
      if(signal?.aborted){record.delivery={...record.delivery,status:'FAILED',error:'CANCELED_BEFORE_SEND',finishedAt:now()};await persist(record);break;}
      record.delivery={...record.delivery,status:'SENDING',attempts:record.delivery.attempts+1,attemptedAt:now()};await persist(record);
      try{
        const acknowledgement=await notifier(record.article,facts,{send:true,http,now,runId,scheduledAt:record.scheduledAt,risks:record.risks || []});
        if(acknowledgement.status!=='SENT' || acknowledgement.acknowledgement?.errcode!==0)throw Object.assign(new Error('DINGTALK_ACK_UNKNOWN'),{code:'DINGTALK_ACK_UNKNOWN'});
        record.delivery={...record.delivery,...acknowledgement,finishedAt:now()};await persist(record);break;
      }catch(e){
        const failure=deliveryFailure(e);record.delivery={...record.delivery,...failure,sent:false,finishedAt:now()};await persist(record);
        if(failure.status==='UNKNOWN' || !failure.retryable || record.delivery.attempts>=2 || signal?.aborted)break;
        try{await sleep(failure.retryAfterMs,undefined,{signal});}catch{break;}
      }
    }
    return record.delivery;
  }finally{inFlight.delete(id);}
}
