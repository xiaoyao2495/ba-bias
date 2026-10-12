// Explicit ESM entry for PM2 fork containers; the original CLI stays intact.
import {startWeb} from './server.js';
try{
  await startWeb();
}catch(error){
  console.error(error.code==='EADDRINUSE'?'WEB_PORT_IN_USE':error.message);
  // Do not leave an initialization failure online through PM2's IPC handle.
  process.exit(1);
}
