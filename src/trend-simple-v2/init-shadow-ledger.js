import path from 'node:path';import {initializeLedger} from './cooldown.js';
const dataDir=path.resolve(process.env.TREND_V2_DATA_DIR||'data-v2');initializeLedger(path.join(dataDir,'shadow-simulation.sqlite'));console.log('SHADOW_SIMULATION_LEDGER_INITIALIZED');
