import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const names=new Set(['src/market/detector.js','src/market/scanner.js','src/market/opportunity-selector.js','src/main.js']);
export async function load(url,context,next){if(url.startsWith('file://'+root)){const name=url.slice(('file://'+root).length);if(names.has(name))return {format:'module',shortCircuit:true,source:await fs.readFile(new URL('before/'+name,import.meta.url),'utf8')};}return next(url,context);}
