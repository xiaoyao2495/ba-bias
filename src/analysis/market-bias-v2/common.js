import crypto from 'node:crypto';
export const CONTRACT='BA_BIAS_MARKET_BIAS_V2';
export const NAMESPACE='market-bias-v2';
export const canonical=x=>JSON.stringify(order(x));
function order(x){if(Array.isArray(x))return x.map(order);if(x&&typeof x==='object')return Object.fromEntries(Object.keys(x).sort().map(k=>[k,order(x[k])]));return x;}
export const sha=x=>crypto.createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:canonical(x)).digest('hex');
export const recordId=x=>'bias_'+sha({contract:CONTRACT,runId:x.runId,symbol:x.symbol,contextId:x.contextId}).slice(0,32);
export const fail=(code,stage='INPUT')=>Object.assign(Error(code),{code,stage});
export function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
