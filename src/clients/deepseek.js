import {config} from '../config.js';
import {Http} from './http.js';
export class DeepSeek {
  constructor(http=new Http({concurrency:1,spacing:0,retries:1})){this.http=http;this.calls=[];}
  async json(system,input,{maxTokens=2400}={}) {
    if(!Number.isInteger(maxTokens)||maxTokens<1||maxTokens>16384)throw new Error('INVALID_LLM_OUTPUT_BUDGET');
    if(!config.deepseekKey)throw new Error('MISSING_DEEPSEEK_API_KEY');
    const started=Date.now();
    const raw=await this.http.request({method:'POST',url:config.deepseekBase.replace(/\/$/,'')+'/chat/completions',
      proxy:process.env.DEEPSEEK_PROXY_ENABLED==='1'?config.proxy:false,timeout:60000,
      headers:{Authorization:`Bearer ${config.deepseekKey}`},
      data:{model:config.deepseekModel,temperature:0,thinking:{type:'disabled'},max_tokens:maxTokens,response_format:{type:'json_object'},
        messages:[{role:'system',content:system},{role:'user',content:JSON.stringify(input)}]}});
    const text=raw?.choices?.[0]?.message?.content;
    this.calls.push({model:raw?.model,usage:raw?.usage || null,durationMs:Date.now()-started,raw});
    if(typeof text!=='string' || !text.trim())throw new Error('EMPTY_LLM_RESPONSE');
    try{return JSON.parse(text);}catch{throw new Error('INVALID_LLM_JSON');}
  }
}
