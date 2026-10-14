import fs from 'node:fs';
import {CONTRACT} from './market-bias-v2/common.js';
export function activeAnalyst(file=new URL('./active-analyst.json',import.meta.url)){const value=JSON.parse(fs.readFileSync(file));if(value.activeAnalyst!==CONTRACT||value.automaticFallback!==false)throw Error('INVALID_ACTIVE_ANALYST');return CONTRACT;}
