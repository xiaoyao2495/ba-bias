import {loadWebEnvironment,webConfig} from '../src/web/config.js';
import {Reader} from '../src/web/reader.js';
loadWebEnvironment();
try{const c=webConfig(),r=new Reader(c.dataDir),index=await r.runsIndex();console.log(JSON.stringify({webConfiguration:'VALID',bind:c.host,port:c.port,origin:c.origin,secureCookie:c.secure,authentication:'SCRYPT_PASSWORD_AND_SESSION',dataIndex:index.indexError??'READABLE',indexedRuns:index.items.length,unindexedBeyondLimit:index.unindexedBeyondLimit,externalCalls:0,scannerStarted:false},null,2));}catch(e){console.error(e.message);process.exitCode=1;}
