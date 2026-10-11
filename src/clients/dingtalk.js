import {config,times} from '../config.js';
import {Http} from './http.js';
export function notification(article,facts,{runId=facts.runId,scheduledAt=null,risks=[]}={}){
  const scanTime=times(scheduledAt ?? facts.evaluationTime.ms).shanghai.slice(0,16).replace('T',' ');
  const evidence=article.evidenceIds.map(id=>facts.evidence.find(e=>e.evidenceId===id)).filter(Boolean).map(e=>`• ${e.phrase}`).join('\n');
  return `检测 · BA-BIAS Shadow\n\n【Binance Square · 待人工审核】\n【待人工审核｜非自动发布】\n\n扫描时间：${scanTime}（北京时间）\n币种：$${article.symbol}\n类型：${article.storyType}\n\n标题：\n${article.title}\n\n正文：\n${article.body}\n\n关键证据：\n${evidence}\n\n风险与待观察项：\n${article.observation}\n统计不证明持仓方向或资金流入，因果解释须人工审核。\n\nRunId：${runId}\n来源：BA-BIAS\n状态：仅供人工审核，未自动发布`;
}
export async function sendText(content,{http=new Http({retries:0}),now=Date.now}={}) {
  if(!config.webhook){const e=new Error('MISSING_DINGTALK_WEBHOOK');e.code=e.message;e.definiteFailure=true;throw e;}
  let url;
  try{new URL(config.webhook);url=config.webhook;}catch{const e=new Error('INVALID_DINGTALK_WEBHOOK');e.code=e.message;e.definiteFailure=true;throw e;}
  const r=await http.request({method:'POST',url,proxy:process.env.DINGTALK_PROXY_ENABLED==='1'?config.proxy:false,timeout:15000,
    data:{msgtype:'text',text:{content}}},{retry:false});
  if(!r || !Number.isInteger(r.errcode)){const e=new Error('DINGTALK_ACK_UNKNOWN');e.code=e.message;throw e;}
  if(r.errcode!==0){const e=new Error('DINGTALK_BUSINESS_FAILURE');e.code=e.message;e.businessCode=r.errcode;e.definiteFailure=true;
    e.rateLimited=/限流|频率|频繁|too.*(?:frequen|fast)|frequen|rate.*limit/i.test(String(r.errmsg || ''));e.retryable=e.rateLimited;throw e;}
  return {status:'SENT',sent:true,acknowledgedAt:now(),acknowledgement:{errcode:0}};
}
export async function sendNotification(article,facts,{send=false,http,now=Date.now,...metadata}={}) {
  if(!send)return {status:'SHADOW',sent:false};
  return sendText(notification(article,facts,metadata),{http,now});
}
