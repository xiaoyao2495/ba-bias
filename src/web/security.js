import crypto from 'node:crypto';
import {promisify} from 'node:util';
const scrypt=promisify(crypto.scrypt);
export async function hashPassword(password){
 if(typeof password!=='string'||password.length<12||password.length>256)throw Error('PASSWORD_MUST_HAVE_12_TO_256_CHARACTERS');
 const salt=crypto.randomBytes(16).toString('hex');return `scrypt$${salt}$${(await scrypt(password,salt,64)).toString('hex')}`;
}
export async function verifyPassword(password,hash){
 if(typeof password!=='string'||password.length>256)return false;
 const [,salt,digest]=hash.split('$');const actual=await scrypt(password,salt,64);return crypto.timingSafeEqual(actual,Buffer.from(digest,'hex'));
}
export function limiter({now=Date.now,max=120,windowMs=60000,capacity=2000}={}){
 const buckets=new Map();return key=>{const t=now();for(const [k,v]of buckets)if(v.until<=t)buckets.delete(k);let b=buckets.get(key);if(!b){if(buckets.size>=capacity)return false;b={until:t+windowMs,count:0};buckets.set(key,b);}return ++b.count<=max;};
}
export function sessions({now=Date.now,ttl=8*3600000}={}){
 const map=new Map();const prune=()=>{for(const [k,v]of map)if(v.expires<=now())map.delete(k);};
 return {create(){prune();if(map.size>=100)throw Error('SESSION_CAPACITY');const id=crypto.randomBytes(32).toString('hex'),csrf=crypto.randomBytes(24).toString('hex');map.set(id,{csrf,expires:now()+ttl});return {id,csrf};},get(id){prune();return map.get(id)||null;},remove(id){map.delete(id);}};
}
export function sanitize(value,secrets=[],depth=0){
 if(depth>18)return null;
 if(typeof value==='string'){let s=value.slice(0,100000);for(const secret of secrets)if(secret.length>=8)s=s.split(secret).join('[REDACTED]');return s.replace(/(?:sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{16,})/g,'[REDACTED]').replace(/(access_token=)[^\s&"']+/gi,'$1[REDACTED]').replace(/Bearer\s+[^\s"']+/gi,'Bearer [REDACTED]');}
 if(Array.isArray(value))return value.slice(0,2000).map(x=>sanitize(x,secrets,depth+1));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([k])=>!/(?:secret|password|webhook|api.?key|access.?token|authorization|rawResponse|raw|factsPath|commitReceiptPath|outboxPath|^path$)/i.test(k)).map(([k,v])=>[k,sanitize(v,secrets,depth+1)]));
 return value??null;
}
