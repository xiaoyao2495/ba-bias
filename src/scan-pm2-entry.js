// Explicit ESM entry for PM2 fork containers; scheduling stays in scan-daemon.
import {startScanner} from './scan-daemon.js';
import {safeError} from './config.js';
try{
  await startScanner();
}catch(error){
  console.error(safeError(error));
  // PM2's IPC handle may keep the container alive; failure must terminate it.
  process.exit(1);
}
