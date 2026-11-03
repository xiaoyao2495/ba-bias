import {startV2Scanner} from './daemon.js';
try { await startV2Scanner(); } catch (error) { console.error(error.code || error.message); process.exit(1); }
