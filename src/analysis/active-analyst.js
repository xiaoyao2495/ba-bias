import fs from 'node:fs';
export function activeAnalyst(file=new URL('./active-analyst.json',import.meta.url)){
 const value=JSON.parse(fs.readFileSync(file));if(!['V3','V4'].includes(value.activeAnalyst)||value.automaticFallback!==false)throw Error('INVALID_ACTIVE_ANALYST');return value.activeAnalyst;
}
