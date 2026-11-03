import path from 'node:path';import {openLiveLedger,promoteToProduction} from './live-ledger.js';
if(process.argv[2]!=='--confirm-authorized-production')throw Error('CONFIRMATION_REQUIRED');
if(!process.env.TREND_V2_DATA_DIR)throw Error('DATA_DIR_REQUIRED');
const db=openLiveLedger(path.join(path.resolve(process.env.TREND_V2_DATA_DIR),'live-research.sqlite'));
try{promoteToProduction(db,'AUTHORIZE_V2_LIVE_PRODUCTION');console.log('LIVE_LEDGER_PROMOTED');}finally{db.close();}
