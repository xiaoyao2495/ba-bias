// Strict offline replay. Direct reads and pure validators only: no scanner,
// HTTP client, LLM object, delivery worker or storage reconciliation is invoked.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {semanticViolations} from '../src/analysis/evidence-text-validator.js';
import {guardDirectional} from '../src/analysis/directional-analyst.js';
import {directionalInput} from '../src/analysis/directional-context.js';
import {validateDirectional,validateInput} from '../src/analysis/directional-schema.js';
import {inspectJudgeContract} from '../src/content/story-judge.js';
import {verifiedFacts,buildIntelligence} from '../src/intelligence/packet.js';
import {compactIntelligenceText} from '../src/intelligence/compact-renderer.js';
import {splitMessage} from '../src/storage/delivery-queue.js';
import {guardDraft} from '../src/content/claim-guard.js';
const output='validation/BA_BIAS_VALIDATION_RECOVERY_V1',read=async f=>JSON.parse(await fs.readFile(f,'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const audit=await read('BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_ANALYSIS.json');
let oldSource=await fs.readFile(output+'/original-directional-analyst.txt','utf8');
oldSource=oldSource.replace(/from '([^']+)'/g,(_,specifier)=>"from '"+pathToFileURL(path.resolve('src/analysis',specifier)).href+"'");
const oldGuard=(await import('data:text/javascript;base64,'+Buffer.from(oldSource).toString('base64'))).guardDirectional;
const attempts=[],research=[],missing=[];
for(const r of audit.analysts){
  const d=await read(r.file),f=verifiedFacts(await read(`data/runs/${r.runId}/facts/${r.symbol}.json`));
  const canonical=directionalInput(f);
  if(JSON.stringify(canonical)!==JSON.stringify(d.input))throw Error('SAVED_INPUT_NOT_CANONICAL '+r.file);
  for(const [i,t] of d.attempts.entries()){
    const meta=r.attempts[i],ref=meta.rawResponseReference;let rawContent=null;
    if(ref){const [file,pointer]=ref.split('#');const calls=await read(file);rawContent=pointer.split('/').slice(1).reduce((v,k)=>v?.[k],calls);}
    if(typeof rawContent!=='string'){missing.push(ref || r.file+'#'+i);continue;}
    let raw;try{raw=JSON.parse(rawContent);}catch(e){attempts.push({runId:r.runId,symbol:r.symbol,attempt:t.attempt,rawBias:meta.rawBias,classification:'CONTRACT_FAILURE',oldErrors:['INVALID_LLM_JSON'],newErrors:['INVALID_LLM_JSON'],newValid:false,reference:ref,parseError:e.message});continue;}
    if(t.raw&&JSON.stringify(t.raw)!==JSON.stringify(raw))throw Error('RAW_RESPONSE_MISMATCH '+ref);
    const schemaPass=validateDirectional(raw),old=oldGuard(raw,canonical),next=guardDirectional(raw,canonical);
    if(JSON.stringify(old.errors)!==JSON.stringify(t.errors))throw Error('ORIGINAL_GUARD_NOT_REPRODUCED '+ref);
    const confirmed=audit.confirmedNegationFalsePositives.filter(x=>x.runId===r.runId&&x.symbol===r.symbol&&x.attempt===t.attempt);
    attempts.push({runId:r.runId,symbol:r.symbol,attempt:t.attempt,rawBias:raw.marketBias,horizon:raw.horizon,schemaPass,oldErrors:old.errors,newErrors:next.errors,newValid:next.ok,
      classification:!schemaPass?'CONTRACT_FAILURE':next.ok?'FALSE_REJECTION':'TRUE_REJECTION',reference:ref,factsReference:`data/runs/${r.runId}/facts/${r.symbol}.json`,
      evidenceIds:[...raw.supportingEvidenceIds,...raw.conflictingEvidenceIds],originalProse:Object.fromEntries(['horizonReason','marketThesis','marketMechanism','preferredScenario','invalidation','alternativeScenario','followUpChecks'].map(k=>[k,raw[k]])),diagnostics:next.diagnostics,confirmedOriginalNegationFalsePositives:confirmed});
  }
  const rows=attempts.filter(x=>x.runId===r.runId&&x.symbol===r.symbol),valid=rows.filter(x=>x.newValid),chosen=valid[0];
  research.push({runId:r.runId,symbol:r.symbol,oldStatus:d.status,newStatus:chosen?'VALIDATED':'ANALYST_UNAVAILABLE',bias:chosen?.rawBias ?? null,selectedAttempt:chosen?.attempt ?? null,passingAttempts:valid.map(x=>x.attempt),passingBiases:[...new Set(valid.map(x=>x.rawBias))],reference:r.file});
}
const judges=[];
for(const r of audit.judgeFailures){
  const [file,pointer]=r.responseReference.split('#'),calls=await read(file),content=pointer.split('/').slice(1).reduce((v,k)=>v?.[k],calls);
  let raw;try{raw=JSON.parse(content);}catch{judges.push({...r,recoveryStatus:'NOT_RECOVERABLE',contractStatus:'INVALID_LLM_JSON',factsStatus:'NOT_CHECKED',claimGuardStatus:'NOT_CHECKED'});continue;}
  const contract=inspectJudgeContract(raw),f=verifiedFacts(await read(`data/runs/${r.runId}/facts/${r.symbol}.json`));
  const ids=raw.keyEvidenceIds || [],draftIds=[...new Set([...ids,...f.evidence.map(e=>e.evidenceId)])].slice(0,4);
  const evidenceValid=ids.every(id=>f.evidence.some(e=>e.evidenceId===id));
  const guard=guardDraft({symbol:f.symbol,storyType:raw.storyType,title:'{{symbol}}市场情报',body:draftIds.map(id=>'{{'+id+'}}').join('\n'),observation:'后续观察价格、合约数量、成交量与结算费率的变化。',evidenceIds:draftIds},f,raw);
  judges.push({runId:r.runId,symbol:r.symbol,rawEligible:raw.eligible,rawScore:raw.newsworthinessScore,storyType:raw.storyType,comparisonStatus:'ORIGINAL_REQUEST_NOT_ARCHIVED',scoreThresholdPass:raw.newsworthinessScore>=65,recoveryStatus:contract.recoveryStatus,contractErrors:contract.errors,deterministicallyRecovered:false,fullContractPass:contract.valid,factsStatus:evidenceValid?'VERIFIED':'UNKNOWN_EVIDENCE',claimGuardStatus:guard.ok?'PASS_EXISTING_EVIDENCE_TEMPLATE':'FAIL',claimGuardErrors:guard.errors,evidenceIds:ids,reference:r.responseReference});
}
const compact=[];
for(const r of audit.rows.filter(r=>r.runId==='hourly_20261010_2200'&&r.judgeSelectedNotInPacket?.length)){
  const record=await read(r.outboxPath),facts=await read(r.factsPath),judge=await read(r.judgePath);
  // Reuse the actual persisted comparison/display metadata; no History update.
  const original=record.intelligence;
  const c={storyType:record.storyType,reason:original.whatChanged.reason,current:record.summary,previous:original.whatChanged.previousRunId?{runId:original.whatChanged.previousRunId,summary:Object.fromEntries(original.whatChanged.changes.map(x=>[x.metric,x.previous])),evidenceIds:[]}:null};
  const {packet}=buildIntelligence(facts,judge,c);
  packet.directional=structuredClone(original.directional);packet.whatChanged=structuredClone(original.whatChanged);
  const text=compactIntelligenceText(packet,record),old=record.delivery.parts.map(p=>p.content.split('\n').slice(3).join('\n')).join('');
  const parts=splitMessage(text,{id:record.delivery.deliveryId,symbol:record.symbol});
  const core=packet.coreEventEvidenceIds.filter(id=>id.endsWith('price.drawdown')||id.endsWith('price.rangeLowHigh'));
  compact.push({runId:r.runId,symbol:r.symbol,evidenceIds:judge.keyEvidenceIds,coreIds:core,coreFacts:core.map(id=>facts.evidence.find(e=>e.evidenceId===id)),oldBodyChars:[...old].length,newBodyChars:[...text].length,oldPartCount:record.delivery.parts.length,newPartCount:parts.length,oldText:old,newText:text,allCorePreserved:core.every(id=>text.includes(facts.evidence.find(e=>e.evidenceId===id).phrase)),lossless:parts.map(p=>p.split('\n').slice(3).join('\n')).join('')===text,reference:r.outboxPath,factsReference:r.factsPath,judgeReference:r.judgePath});
}
const biases=rows=>Object.fromEntries(['BULLISH','BEARISH','BULLISH_REVERSAL','BEARISH_REVERSAL','NO_EDGE'].map(b=>[b,rows.filter(x=>x.rawBias===b||x.bias===b).length]));
const before=await read(output+'/before-hashes.json'),allowed=new Set(['src/analysis/directional-analyst.js','src/content/story-judge.js','src/content/schemas.js','src/intelligence/packet.js','src/intelligence/compact-renderer.js','src/main.js','test/compact.test.js']);
const changed=[],unexpected=[];
const walk=async d=>(await Promise.all((await fs.readdir(d,{withFileTypes:true})).map(async e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]))).flat();
const addedDataFiles=(await walk('data')).filter(f=>!(f in before));if(addedDataFiles.length)throw Error('NEW_PRODUCTION_DATA_FILES '+addedDataFiles.join(','));for(const [file,expected] of Object.entries(before)){const actual=hash(await fs.readFile(file));if(actual!==expected){changed.push(file);if(!allowed.has(file))unexpected.push(file);}}
const summary={independentResearch:research.length,modelResponses:attempts.length,jsonParsed:attempts.filter(a=>a.schemaPass!==undefined).length,schemaPass:attempts.filter(a=>a.schemaPass).length,oldNumericRejected:attempts.filter(a=>a.oldErrors.includes('UNTRUSTED_NUMBER_OR_PROBABILITY')).length,confirmedNegationSnippets:audit.confirmedNegationFalsePositives.length,confirmedNegationSnippetsCleared:audit.confirmedNegationFalsePositives.filter(x=>semanticViolations(x.quote).every(d=>d.denied)).length,confirmedNegationAffectedAttempts:new Set(audit.confirmedNegationFalsePositives.map(x=>x.runId+':'+x.symbol+':'+x.attempt)).size,
  newPassingResponses:attempts.filter(a=>a.newValid).length,newPassingResponseBiases:biases(attempts.filter(a=>a.newValid)),newPassingResearch:research.filter(r=>r.newStatus==='VALIDATED').length,newPassingResearchBiases:biases(research.filter(r=>r.newStatus==='VALIDATED')),stillFailedResearch:research.filter(r=>r.newStatus!=='VALIDATED').length,missingRecords:missing.length,
  stillRejectedSchemaResponses:attempts.filter(a=>a.schemaPass&&!a.newValid).length,numericGateFalseRejectionsRemoved:attempts.filter(a=>a.schemaPass&&!a.newErrors.includes('UNTRUSTED_NUMBER_OR_PROBABILITY')).length,remainingNumericRejected:attempts.filter(a=>a.newErrors.includes('UNTRUSTED_NUMBER_OR_PROBABILITY')).length,onlyMissingJudgeAngle:judges.filter(j=>j.recoveryStatus==='REQUIRES_LLM_RETRY').length,judgeOtherFailures:judges.filter(j=>j.recoveryStatus==='NOT_RECOVERABLE').length,deterministicJudgeRecoveries:0,fullJudgeRecoveries:judges.filter(j=>j.fullContractPass).length,compactCases:compact.length,allCompactCorePreserved:compact.every(c=>c.allCorePreserved&&c.lossless),changedBaselineFiles:changed,unexpectedChangedFiles:unexpected};
if(unexpected.length)throw Error('PROTECTED_FILE_CHANGED '+unexpected.join(','));
const representative=[];
for(const [category,pattern] of [['PRICE_FACT',/:price\.closed/],['OI_FACT',/:oi\./],['FUNDING_FACT',/:funding\./],['ACCOUNT_PP_FACT',/:global\.(?:long|short)\.change/],['TIME_WINDOW',/(?:1|4|24)(?:h|小时)/]]){
  const a=attempts.find(a=>a.schemaPass&&Object.values(a.originalProse).some(v=>typeof v==='string'&&pattern.test(v))),entry=Object.entries(a?.originalProse || {}).find(([k,v])=>typeof v==='string'&&pattern.test(v));
  if(a&&entry)representative.push({category,runId:a.runId,symbol:a.symbol,attempt:a.attempt,field:entry[0],originalSnippet:entry[1],oldErrors:a.oldErrors,newErrors:a.newErrors,evidenceIds:a.evidenceIds,classification:a.classification,reference:a.reference,wholeResponseExpected:a.newValid?'PASS':'REJECT',fragmentNote:'引用是否已声明及数值/窗口绑定见该响应diagnostics；片段有效不代表整份响应有效。'});
}
const negative=attempts.find(a=>a.confirmedOriginalNegationFalsePositives?.length);representative.push({category:'NEGATION',originalSnippet:negative.confirmedOriginalNegationFalsePositives[0].quote,oldErrors:negative.oldErrors,newErrors:negative.newErrors,classification:negative.classification,reference:negative.reference,wholeResponseExpected:negative.newValid?'PASS':'REJECT',fragmentNote:'显式限制说明应免于关键词肯定断言误拦；其他错误继续验证。'});
const untrusted=attempts.find(a=>a.diagnostics?.some(d=>d.code==='UNVERIFIED_NUMERIC_FACT'));representative.push({category:'UNSUPPORTED_NUMERIC_RULE',originalSnippet:JSON.stringify(untrusted.originalProse.invalidation),evidenceIds:untrusted.evidenceIds,oldErrors:untrusted.oldErrors,newErrors:untrusted.newErrors,classification:untrusted.classification,reference:untrusted.reference,wholeResponseExpected:'REJECT'});
for(const category of ['UNSUPPORTED_SUPPORT_PRICE','INVENTED_WIN_RATE_OR_RETURN'])representative.push({category,status:'NOT_FOUND_IN_SAVED_RESPONSES',verification:'Mock adversarial coverage in test/validation-recovery.test.js; excluded from historical counts.'});
const result={summary,representative,attempts,research,judges,compact,missing,noSideEffects:{snapshotFiles:Object.keys(before).length,protectedFilesUnchanged:true,noNetworkToolsInvoked:true,productionWrites:false,addedDataFiles,unchangedDataFiles:Object.keys(before).filter(f=>f.startsWith('data/')).length,envUnchanged:true},selectionRule:'Earliest passing original attempt per Symbol-Run; every passing attempt and disagreement separately retained.'};
await fs.writeFile(output+'/replay.json',JSON.stringify(result,null,2));
const esc=s=>String(s??'—').replaceAll('|','\\|').replaceAll('\n',' ');
let md='# BA_BIAS_VALIDATION_RECOVERY_V1_REPLAY\n\n原始响应未改写。输出目录独立于data；只读Facts重建输入与保存input完全一致。FALSE_REJECTION仅表示整份响应现在通过；局部误拦另列，不能将两者混用。TRUE_REJECTION表示仍有明确合同外验证错误，具体见newErrors；定性机制未通过不改写为合格。\n\n统计：\n\n```json\n'+JSON.stringify(summary,null,2)+'\n```\n\n## 独立研判（70个Symbol-Run）\n\n| RunId | Symbol | 原状态 | 新状态 | 有效方向 | 首个通过尝试 | 证据位置 |\n|---|---|---|---|---|---|---|\n';
for(const r of research)md+='|'+[r.runId,r.symbol,r.oldStatus,r.newStatus,r.bias,r.selectedAttempt,r.reference].map(esc).join('|')+'|\n';
md+='\n## 响应级逐条回放\n\n| RunId | Symbol | 尝试 | 原方向 | 原错误 | 新错误/状态 | 分类 | Evidence | 原始响应位置 |\n|---|---|---|---|---|---|---|---|---|\n';
for(const a of attempts)md+='|'+[a.runId,a.symbol,a.attempt,a.rawBias,a.oldErrors.join(', '),a.newValid?'VALIDATED':a.newErrors.join(', '),a.classification,a.evidenceIds?.join(', '),a.reference].map(esc).join('|')+'|\n';
md+='\n## Story Judge合同失败\n\nClaim Guard PASS只证明既有证据模板可用，不表示缺storyAngle合同已通过，也不表示26个eligible:true已获资格。无法从现有reason确定性生成核心叙事；没有真实模型调用。\n\n| RunId | Symbol | eligible | 评分 | Schema错误 | 恢复状态 | Facts | Claim Guard | Evidence | 原始位置 |\n|---|---|---|---|---|---|---|---|---|---|\n';
for(const j of judges)md+='|'+[j.runId,j.symbol,j.rawEligible,j.rawScore,JSON.stringify(j.contractErrors || j.errors),j.recoveryStatus,j.factsStatus,j.claimGuardStatus,j.evidenceIds?.join(', '),j.reference||j.responseReference].map(esc).join('|')+'|\n';
md+='\n## 四个精简回放\n\n';for(const c of compact)md+=`### ${c.symbol}\n\nFacts/Judge/旧消息：${c.factsReference}；${c.judgeReference}；${c.reference}。\n\n旧正文${c.oldBodyChars}字符/${c.oldPartCount}片 → 新正文${c.newBodyChars}字符/${c.newPartCount}片。CORE_EVENT_EVIDENCE全部保留：${c.allCorePreserved}；无损：${c.lossless}。\n\n原Judge选择：${c.evidenceIds.join(', ')}。新增核心事实：${c.coreFacts.map(e=>e.phrase).join('；')}。\n\n旧消息：\n\n\`\`\`text\n${c.oldText}\n\`\`\`\n\n新消息（仅离线，未投递）：\n\n\`\`\`text\n${c.newText}\n\`\`\`\n\n`;
md+='\n## 代表性片段与边界\n\n历史文本以窗口和规则阈值为主；没有发现手写价格/OI实际百分比事实、手写Funding/账户百分点实际值、支撑价格或虚构胜率数值的完整可复原历史案例。这些类别以专项Mock进行对抗验证，不混入历史通过数。\n\n';
for(const code of ['VERIFIED_NUMERIC_FACT','VERIFIED_RULE_LITERAL','UNVERIFIED_NUMERIC_FACT']){const a=attempts.find(a=>a.diagnostics?.some(d=>d.code===code));if(a)md+=`- ${code}：${a.runId}/${a.symbol}/attempt${a.attempt}，${a.reference}；${esc(JSON.stringify(a.originalProse.invalidation))}；完整状态${a.newValid?'VALIDATED':a.newErrors.join(', ')}。\n`;}
for(const a of attempts.filter(a=>a.confirmedOriginalNegationFalsePositives?.length).slice(0,8))md+=`- 否定误拦：${a.reference}；${a.confirmedOriginalNegationFalsePositives.map(x=>x.quote).join('；')}；旧${a.oldErrors.join(', ')}；新${a.newErrors.join(', ')||'VALIDATED'}。\n`;
md+='\n九类代表性检查：\n\n';for(const x of representative)md+=`- ${x.category}：${x.status || x.classification}；${esc(x.originalSnippet || x.verification)}；原错误${x.oldErrors?.join(', ') || '—'}；新错误${x.newErrors?.join(', ') || '—'}；Evidence ${x.evidenceIds?.join(', ') || '—'}；${x.reference || 'Mock专项测试'}。\n`;
md+='\n完整原文、每个数值绑定诊断、Schema错误、证据ID和只读验证结果见 validation/BA_BIAS_VALIDATION_RECOVERY_V1/replay.json。分类判断针对完整响应，不把局部数字/否定误拦计为整份可恢复。\n';
await fs.writeFile('BA_BIAS_VALIDATION_RECOVERY_V1_REPLAY.md',md);console.log(JSON.stringify(summary,null,2));
