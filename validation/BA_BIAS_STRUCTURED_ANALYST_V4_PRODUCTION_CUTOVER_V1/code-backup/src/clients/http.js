import axios from 'axios';
import {setTimeout as pause} from 'node:timers/promises';
import {safeError} from '../config.js';
export class Http {
  constructor({transport=axios.request,sleep=pause,now=Date.now,concurrency=3,spacing=150,retries=2,signal}={}) {
    Object.assign(this,{transport,sleep,now,concurrency,spacing,retries,signal});
    this.metrics={requests:0,retries:0,cooldowns:0,maxUsedWeight:0};
    this.futuresDataStarts=[];
    this.active=0;this.queue=[];this.next=0;this.blockedUntil=0;this.weightLimit=2400;
  }
  async slot() {
    if(this.active>=this.concurrency) await new Promise(resolve=>this.queue.push(resolve));
    else this.active++;
  }
  release(){const next=this.queue.shift();if(next)next();else this.active--;}
  async request(options,{retry=true}={}) {
    await this.slot();
    try {
      for(let attempt=0;;attempt++) {
        this.signal?.throwIfAborted();
        const start=Math.max(this.now(),this.next,this.blockedUntil);this.next=start+this.spacing;
        await this.sleep(Math.max(0,start-this.now()),undefined,{signal:this.signal});
        while(this.blockedUntil>this.now()){await this.sleep(this.blockedUntil-this.now(),undefined,{signal:this.signal});}
        this.signal?.throwIfAborted();
        try {
          // Futures statistics additionally have an IP request-count ceiling,
          // even when their REQUEST_WEIGHT is zero. Count retries too.
          if(options.url?.includes('/futures/data/')){
            this.futuresDataStarts=this.futuresDataStarts.filter(t=>t>this.now()-300000);
            if(this.futuresDataStarts.length>=1000){
              this.metrics.cooldowns++;
              this.blockedUntil=Math.max(this.blockedUntil,this.futuresDataStarts[0]+300000);
              continue;
            }
            this.futuresDataStarts.push(this.now());
          }
          this.metrics.requests++;
          const r=await this.transport({...options,signal:this.signal,maxRedirects:0});
          const used=Number(r.headers?.['x-mbx-used-weight-1m']);
          if(Number.isFinite(used))this.metrics.maxUsedWeight=Math.max(this.metrics.maxUsedWeight,used);
          if(used>this.weightLimit*0.8){this.metrics.cooldowns++;this.blockedUntil=this.now()+60000;}
          return r.data;
        } catch(e) {
          const status=e.response?.status;
          if(status===429 || status===418) {
            const header=e.response?.headers?.['retry-after'];
            const seconds=Number(header);
            const delay=header && Number.isFinite(seconds) ? seconds*1000 : (Date.parse(header)-this.now());
            this.blockedUntil=Math.max(this.blockedUntil,this.now()+Math.max(Number.isFinite(delay)?delay:0,status===418?300000:60000));
          }
          const temporary=[429,500,502,503,504].includes(status) || ['ECONNABORTED','ETIMEDOUT','ECONNRESET','EAI_AGAIN','ECONNREFUSED','ERR_NETWORK','EMPTY_RESPONSE'].includes(e.code);
          if(!retry || attempt>=this.retries || !temporary || this.signal?.aborted) {
            const sanitized=new Error(safeError(e));sanitized.code=e.code || (status?'HTTP_'+status:'REQUEST_FAILED');sanitized.httpStatus=status ?? null;
            const retryAfter=e.response?.headers?.['retry-after'];
            sanitized.retryAfterMs=Number.isFinite(Number(retryAfter))?Number(retryAfter)*1000:Math.max(0,Date.parse(retryAfter)-this.now());throw sanitized;
          }
          this.metrics.retries++;
          await this.sleep(500*2**attempt,undefined,{signal:this.signal});
        }
      }
    } finally {this.release();}
  }
}
