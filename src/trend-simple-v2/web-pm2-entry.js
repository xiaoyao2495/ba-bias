import {startV2Web} from './web-server.js';
try { await startV2Web(); } catch (error) { console.error(error.code || error.message); process.exit(1); }
