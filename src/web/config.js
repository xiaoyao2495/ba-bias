import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export function webConfig(env=process.env){
 const publicReadonly=env.BA_BIAS_WEB_PUBLIC_READONLY==='1';
 const host=env.BA_BIAS_WEB_HOST||'127.0.0.1',port=Number(env.BA_BIAS_WEB_PORT||8787);
 if(!Number.isInteger(port)||port<1||port>65535)throw Error('INVALID_WEB_PORT');
 const origin=env.BA_BIAS_WEB_ORIGIN||`http://${host==='0.0.0.0'?'127.0.0.1':host}:${port}`;
 const u=new URL(origin);if(!['http:','https:'].includes(u.protocol)||u.pathname!=='/'||u.search||u.hash||u.username||u.password)throw Error('INVALID_WEB_ORIGIN');
 const remote=!['127.0.0.1','::1','localhost'].includes(host);
 if(remote&&env.BA_BIAS_WEB_ALLOW_REMOTE!=='1')throw Error('REMOTE_ACCESS_NOT_ENABLED');
 if(publicReadonly&&remote&&(!env.BA_BIAS_WEB_ORIGIN||['0.0.0.0','127.0.0.1','localhost','[::1]'].includes(u.hostname)))throw Error('PUBLIC_ORIGIN_REQUIRED');
 if(!publicReadonly&&remote&&u.protocol!=='https:'&&env.BA_BIAS_WEB_PRIVATE_NETWORK!=='1')throw Error('REMOTE_REQUIRES_HTTPS_OR_EXPLICIT_PRIVATE_NETWORK');
 const passwordHash=env.BA_BIAS_WEB_PASSWORD_HASH||'';
 if(!publicReadonly&&!/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(passwordHash))throw Error('WEB_PASSWORD_HASH_REQUIRED');
 return {mode:publicReadonly?'PUBLIC_READONLY':'PRIVATE_AUTHENTICATED',researchMode:env.RESEARCH_MODE==='TREND_SIMPLE_V1'?env.RESEARCH_MODE:null,publicReadonly,host,port,origin:u.origin,secure:u.protocol==='https:',passwordHash:publicReadonly?'':passwordHash,dataDir:path.resolve(projectRoot,env.BA_DATA_DIR||'data'),projectRoot,sessionMs:8*3600000,staleMs:2*3600000};
}
export function loadWebEnvironment(){
 // Dedicated credentials never need edits to the scanner's .env.
 for(const p of [path.join(projectRoot,'.env'),path.join(projectRoot,'.web.env')])if(fs.existsSync(p))process.loadEnvFile(p);
}
