import fs from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
import {fail} from './common.js';
export const schema=JSON.parse(fs.readFileSync(new URL('./schema.json',import.meta.url)));
const ajv=new Ajv({strict:true,allErrors:true});
const currentResearch=ajv.compile(schema);
export const validateAnalysis=ajv.compile({$ref:schema.$id+'#/$defs/modelAnalysis'});
// Read-only compatibility: archived records never enter new generation or publication.
const legacy=new Ajv({strict:true,allErrors:true}).compile(JSON.parse(fs.readFileSync(new URL('./legacy-schema.json',import.meta.url))));
export const validateResearch=r=>r?.researchFormat==='MINIMAL_MARKET_RESEARCH_V1'?currentResearch(r):legacy(r);
// Tokenize JSON before parsing: JSON.parse silently overwrites duplicate keys.
export function parseAnalysis(text){
 if(typeof text!=='string'||Buffer.byteLength(text)>256*1024)throw fail('INVALID_JSON_SIZE','SCHEMA');
 let i=0;const white=()=>{while(/\s/.test(text[i]||'')&&i<text.length)i++;};
 const str=()=>{const start=i++;let escaped=false;while(i<text.length){const c=text[i++];if(!escaped&&c==='"')return JSON.parse(text.slice(start,i));if(!escaped&&c==='\\')escaped=true;else escaped=false;}throw fail('INVALID_JSON','SCHEMA');};
 const val=()=>{white();if(text[i]==='{'){i++;white();const keys=new Set();if(text[i]==='}'){i++;return;}while(i<text.length){white();if(text[i]!=='"')throw fail('INVALID_JSON','SCHEMA');const k=str();if(keys.has(k))throw fail('DUPLICATE_JSON_KEY','SCHEMA');keys.add(k);white();if(text[i++]!==':')throw fail('INVALID_JSON','SCHEMA');val();white();const c=text[i++];if(c==='}')return;if(c!==',')throw fail('INVALID_JSON','SCHEMA');}}else if(text[i]==='['){i++;white();if(text[i]===']'){i++;return;}while(i<text.length){val();white();const c=text[i++];if(c===']')return;if(c!==',')throw fail('INVALID_JSON','SCHEMA');}}else if(text[i]==='"')str();else {const m=text.slice(i).match(/^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/);if(!m)throw fail('INVALID_JSON','SCHEMA');i+=m[0].length;}};
 try{val();white();if(i!==text.length)throw fail('INVALID_JSON','SCHEMA');const output=JSON.parse(text);if(!validateAnalysis(output)){
  const error=fail('V2_SCHEMA_INVALID','SCHEMA');
  // Only trusted field paths and validation keywords reach the controlled recovery prompt.
  error.schemaIssues=[...new Set((validateAnalysis.errors||[]).slice(0,8).map(x=>`SCHEMA_FIELD:${String(x.instancePath||'/').replace(/[^A-Za-z0-9/_-]/g,'').slice(0,160)}:${String(x.keyword).replace(/[^A-Za-z]/g,'').toUpperCase()}`))];
  throw error;
 }return output;}catch(e){if(e.stage)throw e;throw fail('INVALID_JSON','SCHEMA');}
}
