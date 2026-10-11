// Execute once before any precision edits; preserve original truth review and holdout.
import fs from 'node:fs';import {snapshot,inputFor,hash} from './analyst-live-probe.js';
const dir='validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1',read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'}),live=read('validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/results.json'),old=read('validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/replay.json');
write(dir+'/before-hashes.json',{...snapshot(),...Object.fromEntries(['validation/BA_BIAS_ANALYST_LIVE_PROBE_V1','validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1','validation/BA_BIAS_VALIDATION_RECOVERY_V1'].flatMap(d=>{const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);return walk(d);}).map(p=>[p,hash(p)]))});fs.copyFileSync('src/analysis/directional-alignment-guard.js',dir+'/baseline-guard.txt');fs.copyFileSync('src/analysis/evidence-text-validator.js',dir+'/baseline-numeric.txt');
const rows=[];
for(const x of live){const {input}=inputFor(x.file);for(const a of x.attempts){const textField=d=>d.field==='invalidation'?a.parsedResponse.invalidation.description:d.field?.startsWith('followUp')?a.parsedResponse.followUpChecks[Number(d.field.slice(8))]:a.parsedResponse?.[d.field]||'';const issues=[];
 for(const d of a.validationResult?.diagnostics||[]){if(d.allowed||d.code.startsWith('VERIFIED_'))continue;let classification='UNDETERMINED',basis='需要逐断言核查，错误码不是事实真值';
 if(d.code==='DIRECTIONAL_SCHEMA_INVALID'){classification='TRUE_REJECTION';basis='原始marketThesis长度>400，违反固定Schema';}
 if(['REVERSAL_DIRECTION_NOT_SUPPORTED','INVALIDATION_RULE_DIRECTION_CONFLICT'].includes(d.code)){classification='TRUE_REJECTION';basis='主周期此前为负、当前为正，却声称BEARISH_REVERSAL；实际价格/OI及程序rule方向可独立复核';}
 if(d.code==='UNTRUSTED_SYMBOL_OR_METRIC'){classification='FALSE_REJECTION';basis='该字段使用本Symbol/真实裸Registry ID，非其他币种；候选IDs与原实际输入核对';}
 if(d.code==='FUNDING_DIRECTION_MUST_USE_EVIDENCE'){classification='CONTRACT_MISMATCH';basis='BAT原Funding0.003325%为正，多头支付空头正确；仅裸ID引用没有被used集合识别';}
 if(d.code==='FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED'&&/不保证/.test(textField(d))){classification='FALSE_REJECTION';basis='明确不保证未来方向，非确定性保证';}
 if(d.code==='UNSUPPORTED_CAUSE_OR_ORDER'){
  if(/无法(?:据此)?确认|不能(?:据此)?确认|不(?:构成|确认|保证)/.test(d.span||'')){classification='FALSE_REJECTION';basis='原局部分句是明确否定该未经证实行为，不能把否定关键词当肯定';}
  else{classification='UNDETERMINED';basis='可能机制须按同期价格/OI和局部不确定性核查；涉及具体单侧开平仓，不能默认允许“可能”';}
 }
 if(d.code==='UNAVAILABLE_INDICATOR_OR_STRUCTURE'){classification='TRUE_REJECTION';basis='没有可靠结构而使用结构/突破信息；指标阈值参考例外需单独核对';}
 if(d.code==='WRONG_ACCOUNT_OR_OI_SCOPE'){classification='UNDETERMINED';basis='OI数量推测具体单侧敞口需限制；不能把概率措辞作为依据';}
 if(d.code==='UNVERIFIED_NUMERIC_FACT'){
  const n=Number(d.literal?.match(/[+-]?\d+(?:\.\d+)?/)?.[0]),digits=(d.literal?.match(/\.(\d+)/)?.[1]||'').length,matches=input.evidence.filter(e=>Number.isFinite(Number(e.result))&&Number(Number(e.result).toFixed(digits))===n);
  if(/^\+/.test(d.literal)&&matches.length){classification='FALSE_REJECTION';basis='前导+的该舍入值实际存在；不改变容差，仍必须核查指标/单位/窗口';}
  else if(matches.length){classification='CONTRACT_MISMATCH';basis='数值存在但词法绑定/窗口/角色未充分识别，不能仅按任意同值就放行';}
  else{classification='TRUE_REJECTION';basis='该裸数字未找到对应事实舍入值；若为输入程序阈值应另按rule校验，当前不得猜补';}
 }
 issues.push({...d,classification,basis,fieldText:textField(d)});
 }
 rows.push({symbol:x.symbol,runId:x.runId,evaluationTime:x.evaluationTime,attempt:a.attempt,rawDirection:a.parsedResponse?.marketBias,horizon:a.parsedResponse?.horizon,schema:a.schemaValid,oldErrors:a.failureCodes,facts:x.file,rawReference:`validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/${a.id}.json`,validationReference:`validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/${a.id}.json`,inputReference:`validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/${a.id}.json`,issues,knownExtraRisks:x.symbol==='ERAUSDT'?'无结构却谈近期结构、未经确认拥挤':x.symbol==='BATUSDT'?'回撤被说成已现抛压，需限制已确认参与者行为':null});
}}
write(dir+'/independent-classification.json',{basis:'PRE_EDIT independent raw Facts/Schema/local assertion review, not newly repaired validator. Numeric candidate equality is not sufficient: preserve CONTRACT_MISMATCH/UNDETERMINED and do not call full responses legal.',rows});
const held=[['hourly_20261010_2100','ARPAUSDT',1,true],['hourly_20261010_2100','ARUSDT',2,true],['hourly_20261010_2100','NEIROUSDT',1,true],['hourly_20261010_2200','METUSDT',1,true],['hourly_20261010_2100','VETUSDT',1,true],['hourly_20261010_2200','HEIUSDT',1,true],['hourly_20261010_2100','CFXUSDT',1,false],['hourly_20261010_2100','JCTUSDT',2,false],['hourly_20261010_2200','MOVRUSDT',2,false],['hourly_20261010_2200','SUPERUSDT',1,false]].map(([runId,symbol,attempt,expected])=>{const a=old.attempts.find(a=>a.runId===runId&&a.symbol===symbol&&a.attempt===attempt);if(!a||live.some(x=>x.symbol===symbol&&x.runId===runId))throw Error('HOLDOUT_MISSING_OR_OVERLAP');return {runId,symbol,attempt,expected,reference:a.reference,facts:a.factsReference,reason:expected?'基于原Facts/规则及原报告逐案审查：数值/口径真实，明确条件假设，不含确定性因果；不要求预测真实正确':'原文把OI敞口赋予方向/参与者动机或同向事实与实际符号矛盾，不能允许',original:a.original};});
write(dir+'/holdout.json',{frozenAt:new Date().toISOString(),selection:'10 different Symbol-Run events, disjoint from live probe; same historical era, not an unseen prospective market dataset. Frozen before edits, never used to tune. Prior audit knowledge exists.',cases:held,languageCases:[{text:'4h price increased +10.00%, OI quantity grew +5.63%.',expected:true},{text:'4h价格上涨百分之十，OI数量增长百分之五点六三。',expected:true},{text:'OI increase proves new long positions opened.',expected:false},{text:'不是不能确认空头已经全部爆仓。',expected:false},{text:'1h OI quantity increased 5.63%.',expected:false},{text:'未来4h价格上涨10%。',expected:false},{text:'cannot confirm liquidations.',expected:true},{text:'价格回撤不能证明多头获利了结。',expected:true}]});
console.log(JSON.stringify({liveSamples:live.length,responses:rows.length,holdout:held.length,overlapWith70:live.filter(x=>old.research.some(y=>y.runId===x.runId&&y.symbol===x.symbol)).length}));
