import path from 'node:path';import {initializeLiveLedger} from './live-ledger.js';
if(process.argv[2]!=='--confirm-init-acceptance')throw Error('CONFIRMATION_REQUIRED');
if(!process.env.TREND_V2_DATA_DIR)throw Error('DATA_DIR_REQUIRED');
initializeLiveLedger(path.join(path.resolve(process.env.TREND_V2_DATA_DIR),'live-research.sqlite'),{acceptance:true});
console.log('LIVE_ACCEPTANCE_LEDGER_INITIALIZED');
