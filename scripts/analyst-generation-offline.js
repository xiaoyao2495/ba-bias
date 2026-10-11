// Historical reads and MOCK entry only. No clients, no production writes.
import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
import {generationInput,generationRules,recoveryRules,GENERATION_VERSION,INPUT_FORMAT_VERSION,VALIDATOR_VERSION} from '../src/analysis/directional-generation.js';
import {guardDirectional,analyzeDirectional} from '../src/analysis/directional-analyst.js';import {directionalInput} from '../src/analysis/directional-context.js';import {verifiedFacts} from '../src/intelligence/packet.js';
import {fixture} from '../test/fixtures.js';import {mockDirectional} from '../test/directional-fixture.js';import {detect} from '../src/market/detector.js';import {buildFacts} from '../src/market/facts-engine.js';
const root='validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1',out=process.argv.includes('--verified')?root+'/verified':root,old='validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1',live='validation/BA_BIAS_ANALYST_LIVE_PROBE_V1';
fs.mkdirSync(out,{recursive:true});
const read=p=>JSON.parse(fs.readFileSync(p)),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),write=(p,v)=>fs.writeFileSync(out+'/'+p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const inputFor=p=>directionalInput(verifiedFacts(read(p)),{contractVersion:'DIRECTIONAL_ANALYST_V2'});
const baseline=read(old+'/verified/live-replay.json'),history=read(old+'/verified/historical-replay.json'),held=read(old+'/holdout.json');
const checkedReports=['BA_BIAS_ANALYST_LIVE_PROBE_V1.md','BA_BIAS_ANALYST_LIVE_PROBE_V1_RESULTS.md','BA_BIAS_ANALYST_VALIDATION_PRECISION_V1.md','BA_BIAS_ANALYST_VALIDATION_PRECISION_V1_REPLAY.md','BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1.md','DIRECTIONAL_ANALYST_INPUT_SCHEMA.json','DIRECTIONAL_ANALYST_OUTPUT_SCHEMA.json'];
const cases=[];
for(const r of read(live+'/results.json')){
 const f=verifiedFacts(read(r.file)),v3=generationInput(f),attempts=[];
 assert.deepEqual(v3.evidence,inputFor(r.file).evidence);
 for(const a of r.attempts){
  const request=read(live+'/requests/'+a.id+'.json'),response=read(live+'/responses/'+a.id+'.json'),validation=read(live+'/validation/'+a.id+'.json'),b=baseline.rows.find(x=>x.id===a.id),v=guardDirectional(a.parsedResponse,request.input);
  assert.deepEqual(v,b.newValidation);assert.deepEqual(request.input.evidence,v3.evidence);
  const prose={...Object.fromEntries(['horizonReason','marketThesis','marketMechanism','preferredScenario','alternativeScenario'].map(k=>[k,a.parsedResponse[k]])),invalidation:a.parsedResponse.invalidation.description,followUpChecks:a.parsedResponse.followUpChecks};
  const fieldLengths=Object.fromEntries(Object.entries(prose).map(([k,t])=>[k,typeof t==='string'?[...t].length:t.map(s=>[...s].length)]));
  const numericTokens=JSON.stringify(prose).match(/[+-]?\d+(?:\.\d+)?%/g)||[],repeatedNumericTokens=Object.entries(numericTokens.reduce((n,k)=>(n[k]=(n[k]||0)+1,n),{})).filter(([,n])=>n>1);
  attempts.push({id:a.id,attempt:a.attempt,request:live+'/requests/'+a.id+'.json',response:live+'/responses/'+a.id+'.json',validation:live+'/validation/'+a.id+'.json',originalPrompt:request.system,originalInput:request.input,originalResponse:a.parsedResponse,responseText:a.responseText,originalValidation:validation,validationNow:v,fieldLengths,repeatedNumericTokens,promptCharacters:request.system.length,inputCharacters:JSON.stringify(request.input).length,recoveryErrors:request.input.repairErrors??[],recoveryMustFix:request.input.contractRepair?.mustFix??null,responseFileKeys:Object.keys(response)});
 }
 // Explicitly MOCK: checks future production entry can transmit each complete real Facts package.
 const mock=await analyzeDirectional({json:async(_p,i)=>{const a=mockDirectional(i,{conviction:'LOW'});a.invalidation={type:'METRIC_BASED_REASSESSMENT',ruleIds:[],description:'后续价格与OI同步变化时重新评估。'};return a;}},f);
 assert.equal(mock.status,'VALIDATED');
 cases.push({symbol:r.symbol,runId:r.runId,facts:r.file,evaluationTime:r.evaluationTime,v3Input:v3,attempts,passingAttempts:attempts.filter(a=>a.validationNow.ok).map(a=>a.attempt),mockEntry:{status:mock.status,label:'MOCK_NOT_MODEL_GENERATION',generationVersion:mock.generationVersion}});
}
for(const a of history.attempts){const v=a.original?guardDirectional(a.original,inputFor(a.factsReference),{replayContractVersion:'DIRECTIONAL_ANALYST_V2'}):{ok:false,errors:['INVALID_LLM_JSON'],diagnostics:[]};assert.deepEqual(v,a.newValidation,a.reference);}
const real=held.cases.map(c=>{const v=guardDirectional(c.original,inputFor(c.facts),{replayContractVersion:'DIRECTIONAL_ANALYST_V2'});assert.equal(v.ok,c.expected);return {symbol:c.symbol,expected:c.expected,validation:v};});
const fi=directionalInput(detect(buildFacts(fixture())),{contractVersion:'DIRECTIONAL_ANALYST_V2'}),language=held.languageCases.map(c=>{const a=mockDirectional(fi,{horizon:'4h'});a.marketMechanism=c.text;const v=guardDirectional(a,fi);assert.equal(v.ok,c.expected);return {...c,validation:v};});
const first=cases.map(c=>c.attempts[0]),all=cases.flatMap(c=>c.attempts),distribution=rows=>Object.fromEntries([...new Set(rows.flatMap(a=>a.validationNow.errors))].map(k=>[k,rows.filter(a=>a.validationNow.errors.includes(k)).length]));
const summary={liveHistorical:baseline.summary,historical70:history.summary,unchangedOriginal30:true,unchangedHistorical140:true,holdout:{realMatched:real.length,languageMatched:language.length},mockEntryCount:cases.length,firstFailureCodes:distribution(first),allFailureCodes:distribution(all),firstRawBiasCounts:first.reduce((d,a)=>(d[a.originalResponse.marketBias]=(d[a.originalResponse.marketBias]||0)+1,d),{}),newLiveGeneration:{apiCalls:0,firstPassRate:'UNKNOWN — NOT_TESTED_LIVE',biasDistribution:'NOT_TESTED_LIVE',noEdgeReduction:'NOT_TESTED_LIVE',predictiveEdge:'NOT_TESTED_LIVE',recoveryQuality:'NOT_TESTED_LIVE'},readSources:checkedReports.map(p=>({file:p,sha256:hash(p),characters:fs.readFileSync(p,'utf8').length}))};
write('diagnostics.json',{summary,cases});write('holdout-results.json',{real,language});
const sourceFiles=execFileSync('rg',['--files','src','scripts','test'],{encoding:'utf8'}).trim().split('\n').filter(p=>p.endsWith('.js'));
for(const p of sourceFiles)execFileSync(process.execPath,['--check',p]);write('static-checks.json',{checked:sourceFiles.length,passed:sourceFiles.length,files:sourceFiles});
const validators=['src/analysis/directional-schema.js','src/analysis/directional-alignment-guard.js','src/analysis/directional-legacy-guard.js','src/analysis/evidence-precision-validator.js','src/analysis/evidence-text-validator.js','src/analysis/directional-context.js','src/content/claim-guard.js'].filter(p=>fs.existsSync(p));
const requests=cases.map(c=>read(c.attempts[0].request));assert.ok(requests.every(r=>JSON.stringify(r.generationParameters)===JSON.stringify(requests[0].generationParameters)));
write('frozen-contract.json',{generationVersion:GENERATION_VERSION,inputFormatVersion:INPUT_FORMAT_VERSION,inputSchemaVersion:'DIRECTIONAL_INPUT_V1 with existing open metadata fields',outputSchemaVersion:'DIRECTIONAL_ANALYST_V2',validatorVersion:VALIDATOR_VERSION,
 modelParameters:requests[0].generationParameters,parameterStatus:'existing live probe parameters; client unchanged; runtime model config remains authoritative',modelClientHash:hash('src/clients/deepseek.js'),configHash:hash('src/config.js'),maximumCalls:2,
 prompt:generationRules,recoveryPrompt:recoveryRules,files:Object.fromEntries(['src/analysis/directional-generation.js','src/analysis/directional-analyst.js','DIRECTIONAL_ANALYST_INPUT_SCHEMA.json','DIRECTIONAL_ANALYST_OUTPUT_SCHEMA.json',...validators].map(p=>[p,hash(p)])),policy:'Next live probe must check hashes/model parameters first; no mid-probe prompt changes; no live probe authorized by this task.'});
const before=read(root+'/before-hashes.json'),changed=Object.entries(before).filter(([p,h])=>!fs.existsSync(p)||hash(p)!==h).map(([p])=>p);assert.deepEqual(changed,['src/analysis/directional-analyst.js']);
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);const newData=walk('data').filter(p=>!Object.hasOwn(before,p));assert.deepEqual(newData,[]);
write('integrity.json',{baselineFiles:Object.keys(before).length,protectedFilesUnchanged:Object.keys(before).length-changed.length,changedExisting:changed,productionDataFiles:Object.keys(before).filter(p=>p.startsWith('data/')).length,newData,envUnchanged:hash('.env')===before['.env'],oldValidationUnchanged:true,realExternalApiCalls:0,dingTalkSends:0,scanStarted:false});
console.log(JSON.stringify({summary,static:sourceFiles.length,changed},null,2));
