import {activeAnalyst} from '../src/analysis/active-analyst.js';
import {pathToFileURL} from 'node:url';
export function selectVersion(){throw Error('RESEARCH_VERSION_SWITCH_RETIRED');}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){if(process.argv[2]==='--status')console.log(activeAnalyst());else throw Error('RESEARCH_VERSION_SWITCH_RETIRED');}
