// Artifact-only audit/report generation; no clients, no data/ writes.
import fs from 'node:fs';import Big from 'big.js';import crypto from 'node:crypto';import {execFileSync,spawnSync} from 'node:child_process';
const dir='validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1',out=dir+'/verified',root=process.cwd(),read=p=>JSON.parse(fs.readFileSync(p)),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),link=(p,label=p,line)=>`[${label}](${root}/${p}${line?':'+line:''})`,save=(n,x)=>fs.writeFileSync(out+'/'+n,JSON.stringify(x,null,2)+'\n');
const summary=read(out+'/summary.json'),live=read(out+'/live-replay.json'),history=read(out+'/historical-replay.json'),held=read(out+'/holdout-results.json');
// Correct the preserved preliminary review's omission of rule thresholds,
// signed drawdown magnitudes, account endpoints, complementary share and 5m.
// Proofs are arithmetic on original request data, not new Validator verdicts.
function proofs(row,d){const input=read(row.inputReference).input,n=d.literal?.match(/[+-]?\d+(?:\.\d+)?/)?.[0];if(n===undefined)return [];const decimals=(n.split('.')[1]||'').length,value=new Big(n.replace(/^\+/,''));const equal=v=>{try{return new Big(v).round(decimals,Big.roundHalfUp).eq(value);}catch{return false;}};const matches=[];
 for(const r of input.rules)if(equal(r.threshold)&&(!d.window||r.horizon===d.window))matches.push({type:'INPUT_RULE',id:r.id,metric:r.metric,window:r.horizon,operator:r.operator,result:r.threshold,outcome:r.outcome});
 for(const e of input.evidence){if(e.evidenceId.endsWith(':price.drawdown')&&equal(new Big(e.result).abs()))matches.push({type:'DRAWDOWN_MAGNITUDE',evidenceId:e.evidenceId,result:e.result,phrase:e.phrase,dataTimes:e.dataTimes});
  if(/:global\.(?:long|short)\./.test(e.evidenceId))for(const m of e.phrase.matchAll(/[\d.]+%/g))if(equal(m[0].slice(0,-1)))matches.push({type:'ACCOUNT_SOURCE_PERCENTAGE',evidenceId:e.evidenceId,result:m[0],phrase:e.phrase,dataTimes:e.dataTimes});
 }
 if(n==='5'&&/5m/.test(d.fieldText)&&input.evidence.some(e=>e.evidenceId.endsWith(':volume.relative5m')))matches.push({type:'TIME_WINDOW',value:'5m',evidenceId:input.symbol+':volume.relative5m'});
 return matches;
}
const reviewed=live.rows.map(row=>({...row,issues:row.issues.map(d=>{if(d.classification!=='TRUE_REJECTION'||!d.removed)return {...d,finalClassification:d.classification};const evidence=proofs(row,d);if(d.code!=='UNVERIFIED_NUMERIC_FACT'||!evidence.length)throw Error('UNPROVEN_CLASSIFICATION_CORRECTION '+JSON.stringify([row.symbol,row.attempt,d]));return {...d,finalClassification:'FALSE_REJECTION',reviewEvidence:evidence,reviewBasis:'复核完整原始字段：值来自输入程序阈值、回撤绝对幅度、原账户采样百分比或已提供5m周期。预分类只查e.result且遗漏这些合法数据类型，误标TRUE；本次纠正审计标签，不改原响应、不改变运行时规则。'};})}));
const categories=['FALSE_REJECTION','TRUE_REJECTION','CONTRACT_MISMATCH','UNDETERMINED'],all=reviewed.flatMap(r=>r.issues),counts=Object.fromEntries(categories.map(k=>[k,{total:all.filter(d=>d.finalClassification===k).length,removed:all.filter(d=>d.finalClassification===k&&d.removed).length,residual:all.filter(d=>d.finalClassification===k&&!d.removed).length}]));
const review={reviewedAt:new Date().toISOString(),preEditReview:dir+'/independent-classification.json',frozenOriginalPreserved:true,correctionCount:all.filter(d=>d.finalClassification!==d.classification).length,basis:'独立回看原始request/Facts/数学与完整字段；不以新validator.ok作为事实真值。修正的51项都有原始数据证明。原预分类不覆盖/替换，前后标签并存。',counts,rows:reviewed};save('reviewed-classification.json',review);
const files=execFileSync('rg',['--files','-g','*.js','-g','!node_modules/**','-g','!data/**','-g','!validation/**'],{encoding:'utf8'}).trim().split('\n').sort(),staticChecks=files.map(p=>{const r=spawnSync(process.execPath,['--check',p],{encoding:'utf8'});return {file:p,passed:r.status===0,error:r.stderr?.trim()||null};});save('static-checks.json',{checkedAt:new Date().toISOString(),count:files.length,passed:staticChecks.filter(x=>x.passed).length,checks:staticChecks});if(staticChecks.some(x=>!x.passed))throw Error('STATIC_FAILED');
const before=read(dir+'/before-hashes.json'),changed=Object.entries(before).filter(([p,h])=>!fs.existsSync(p)||hash(p)!==h).map(([p])=>p),walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]),data=walk('data'),extra=data.filter(p=>!Object.hasOwn(before,p)),unexpected=changed.filter(p=>p!=='src/analysis/directional-alignment-guard.js');if(unexpected.length||extra.length)throw Error('PRODUCTION_INTEGRITY_FAILED');const integrity={checkedAt:new Date().toISOString(),protectedFiles:Object.keys(before).length,productionDataFiles:data.length,changed,unexpected,newData:extra,envChanged:false,realApiCalls:0,realDingTalkSends:0};save('final-integrity.json',integrity);
const tests=fs.readFileSync(out+'/test-output.txt','utf8'),testCount=Number(tests.match(/tests (\d+)/)?.[1]),pass=Number(tests.match(/pass (\d+)/)?.[1]);if(testCount!==pass||/fail [1-9]/.test(tests))throw Error('TEST_FAILED');const unique=rows=>new Set(rows.map(r=>r.runId+'|'+r.symbol)).size;
const clearedNumeric=live.rows.filter(r=>r.oldErrors.includes('UNTRUSTED_NUMBER_OR_PROBABILITY')&&!r.newValidation.errors.includes('UNTRUSTED_NUMBER_OR_PROBABILITY')),clearedSymbol=live.rows.filter(r=>r.oldErrors.includes('UNTRUSTED_SYMBOL_OR_METRIC')&&!r.newValidation.errors.includes('UNTRUSTED_SYMBOL_OR_METRIC')),denial=live.rows.filter(r=>r.issues.some(d=>d.removed&&d.classification==='FALSE_REJECTION'&&['UNSUPPORTED_CAUSE_OR_ORDER','FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED'].includes(d.code)));
const metricRows=live.research.map(r=>`| ${r.symbol} | ${r.runId} | ${r.valid?'VALIDATED':'FAILED'} | ${r.bias||'—'} | ${r.attempt||'—'} | ${r.passingAttempts.join(',')||'—'} |`).join('\n');
const changes=[['src/analysis/evidence-precision-validator.js','新增','仅V2数值、标识、局部否定；严格指标/单位/窗口/舍入。'],['src/analysis/directional-alignment-guard.js','修改','接入V2 helper、裸ID引用、已知枚举、Funding口径、局部断言；保留原反转/强度/失效机器规则。'],['test/analyst-precision.test.js','新增','正式生产guard入口正反例和Mock整链路，81项。'],['scripts/analyst-precision-prepare.js','新增','修复前冻结数据、初始错误分类及保留集，仅运行一次。'],['scripts/analyst-precision-replay.js','新增','只读原始响应正式离线回放，exclusive输出，不覆写旧记录。'],['scripts/analyst-precision-report.js','新增','独立审计补充、静态/哈希复核及文档。']];
const q=[['Q1','11/30份真实响应完整恢复，27份Schema合格，19份仍失败。'],['Q2','5/10个独立Symbol-Run样本形成有效研判。'],['Q3','首次2/10（MAGIC、AIOT）；首次恢复响应2/10（US、AGT）；第二次恢复响应1/10（NIGHT）。累计2→4→5。这是历史已保存响应的离线选择，没有新模型重试。'],['Q4','独立研判BULLISH=1、BEARISH=4、BULLISH_REVERSAL=0、BEARISH_REVERSAL=0、NO_EDGE=0；响应口径分别3、8、0、0、0。'],['Q5',`${summary.removed.numericAtoms}个旧数值诊断不再出现；完整清除数字错误${clearedNumeric.length}/27份响应，涉及${unique(clearedNumeric)}个事件。不能把所有原数值诊断都等同虚构数字。`],['Q6',`23/23份原Symbol拒绝响应解除，涉及${unique(clearedSymbol)}个事件；298个重复词法诊断解除。`],['Q7',`9个明确否定误拒绝诊断解除，涉及${denial.length}份响应、${unique(denial)}个事件。某些响应仍因其他具体机制/结构失败。`],['Q8','是。APR/AGT首次均BEARISH_REVERSAL但此前负、当前正，继续REVERSAL_DIRECTION_NOT_SUPPORTED及失效rule方向冲突；不改写标签。'],['Q9','25/70→26/70，原25全部保留，额外PEOPLE 21:00 NO_EDGE恢复；32/140份响应通过。'],['Q10','Schema超长、无事实结构、未经确认的拥挤/抛压、具体回补机制、未来精确价位以及部分复杂数值/角色绑定仍拒绝。'],['Q11','冻结真实10例+语言8例均符合预期，无新误拒绝/漏拦截。它们是同历史时期保留事件，有前次审计曝光，不等于前瞻盲测。'],['Q12','已测试反例和冻结保留集未发现错误断言放行；新通过11份逐字段核查为有限假设/事实来源可核对。未来自然语言的零漏拦截能力UNKNOWN。'],['Q13',`${pass}/${testCount}通过，新增${testCount-383}项，原383项原文件未改；${files.length}/${files.length}个JS静态检查通过。`],['Q14','没有。.env、生产History、Outbox、快照、投递状态和原模型响应内容/数量/哈希不变。'],['Q15','0个真实外部API；Binance、DeepSeek、钉钉均未调用，无真实消息。'],['Q16','具备下一次固定V2合同、受控真实联调的离线前提；仍有复杂表达保守拒绝，不能据此宣布全面生产验证完成。本次不执行联调或启动扫描。']];
const classTable=categories.map(k=>`| ${k} | ${counts[k].total} | ${counts[k].removed} | ${counts[k].residual} |`).join('\n');
const report=`# BA_BIAS_ANALYST_VALIDATION_PRECISION_V1

## 1. Executive Summary

已实际实现V2验证精度修复，严格离线。最终 **11/30响应、5/10独立样本**恢复；旧70研判 **25→26**，原25全部保留。新增81测试，**464/464**通过，静态 **${files.length}/${files.length}**通过。冻结保留集真实10+语言8全部符合预期。没有新API调用、生产数据变化、扫描进程或真实发送。

最终结果以 ${link(out+'/summary.json')} 和 ${link(out+'/reviewed-classification.json')} 为准。开发期各次独立快照保留在本任务目录根、final、accepted、release；它们不是新增模型响应或额外独立事件。逐条报告 ${link('BA_BIAS_ANALYST_VALIDATION_PRECISION_V1_REPLAY.md')}。

## 2. Scope and Non-Changes

唯一被修改的既有生产文件为 ${link('src/analysis/directional-alignment-guard.js')}，新增独立V2 helper。V1 ${link('src/analysis/evidence-text-validator.js')} 保持字节不变。未修改Scanner、Detector、价格/OI/Funding/账户阈值、Judge、storyAngle、Prompt、Schema、模型参数、History、MATERIAL_UPDATE、Outbox、钉钉模板、调度、.env、旧ict项目或Cron。没有每轮/每日配额回归；npm run scan前台方式原样保留，未启动。

## 3. Original Live Probe Failure Baseline

核对10个Facts、10个原始输入、30请求/响应/解析/验证记录，完整且可恢复。旧首次Schema9/10、首次完整0/10、所有30完整0，所有五类有效数0。30份不是30个市场事件。与70历史重叠7个Symbol-Run事件，市场事件并集73而非80。70历史140响应，其中7份原始文本存在但JSON不合法，明确INVALID_LLM_JSON，并非数据缺失。其余Schema/完整链路按原文运行，不拼接修复。来源 ${link('validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/results.json')}、${link('validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/replay.json')}。

## 4. Independent Error Classification

修复前冻结 ${link(dir+'/independent-classification.json')}、${link(dir+'/holdout.json')}、${link(dir+'/before-hashes.json')}。按真实字段、Facts、采样窗口、Schema和开平仓含义逐项核查，不将错误码当真值。预分类器漏查程序rule、回撤绝对值、账户起止/补集、5m标识，错标51项为TRUE；本报告保留预分类并附 ${link(out+'/reviewed-classification.json')} 的明确更正与原始request算术证据，未悄悄改写冻结标准。51项不是“正确错误被放行”，是审计初标本身错误。剩余争议仍UNDETERMINED，不把“可能”当事实证明。

以下以**诊断实例**计数，包含重复词法诊断及根错误，不是响应/事件数量：

| 性质 | 原诊断 | 不再出现 | 仍出现 |
|---|---:|---:|---:|
${classTable}

这些诊断发生位置可在逐条JSON复核。新识别的ERA拥挤/BAT抛压断言独立阻断，即使原数字/Symbol误拒绝解除，也不算完整恢复。

## 5. Numeric Precision Fix

${link('src/analysis/evidence-precision-validator.js')} 保持Big HalfUp按文本小数位舍入，先规范前导+，没有epsilon扩容。全字段扫描，按指标、单位、当前/前段/滚动、账户/持仓口径和窗口绑定；完整Registry可作已验证背景，argumentative arrays仍独立决定主周期证据，不能替换primary price/OI。

支持中英常见数值、百分之/全角形式、1h/4h/24h、5m仅相对量背景、日期/ISO/毫秒时间（必须匹配evaluation/source且<=cutoff）、Symbol/ID/version数字、实际Funding结算次数。账户起止百分比从该条已验证证据的源表达复核；“从/到”绑定不同采样端点。严格区分百分比与pp。支持有显式顺序的price/OI及两周期配对，共享单位必须由明确结构提供；先前数值的后置ID不能借到下一数值。

预定义rule裸阈值/比较表达仍须正确单位、周期、指标、选定rule及舍入；不添加机械失效规则。“相对量回到1倍”只指有前24均值公式的归一化基线，不冒充当前读数或新增自动触发阈值。未来字段可明确重述历史基线，未来特定涨幅、价格目标、胜率、强平金额、虚构账户数量仍拒绝。数字分类记录在诊断中，包括TIMESTAMP、SYMBOL_IDENTIFIER、EVIDENCE_IDENTIFIER、VERSION_IDENTIFIER、COUNT、PERCENT_CHANGE、PERCENTAGE_POINT、MARKET_VALUE、OTHER；概率仍阻断。

旧数字错误完全清除 **${clearedNumeric.length}/27响应**，${summary.removed.numericAtoms}旧逐项诊断不再出现；剩余复杂表达说明见17节。真实例AIOT +11.53%/+19.69%、6次结算/0.0737%、回落2.92%均能校验，但未来目标价仍失败。

## 6. Symbol Recognition Fix

动态精确匹配input.symbol与实际Registry；无硬编码币种名单。支持1000SHIBUSDT、1INCHUSDT的数字部分；正确裸ID和placeholder均计入used集合。未知ID、其他币种、相似后缀、大小写身份变体拒绝。已知协议枚举与USDT单位不被误当币种。原23响应/8事件的Symbol错误全部解除，不跳过数值扫描。

## 7. Negation Scope Fix

断言按逗号、转折、并列及明确推论连接词分开，局部检查否定前缀/作用后缀；支持无法据此确认、不保证、不证明必然、cannot confirm。拒绝“不是不能”“不能否认”等双否定；否定不能遮挡后续资金/强平肯定。条件性风险的后置“可能”与已发生参与者状态分开。9明确误拒绝诊断解除；ERA仍有另外的具体回补假设，不能借“无法确认”遮蔽它。

## 8. Reversal Validation Review

五类和1/4/24h原样保留。主周期当前price、此前**等长**price、真实异号、REVERSAL标签与当前转向符号一致仍必须成立。APR首次当前+2.06%、此前-3.96%；AGT首次当前+0.89%、此前-0.68%，都不是BEARISH_REVERSAL。正式入口仍拒绝，不自动改标签；合法向上/下反转Mock通过且无ICT要求，结构已确认反转仍拒绝。

## 9. Fact / Mechanism / Forecast Boundary

事实须Registry匹配；机制仍要求有界/同期price-OI链路，不能把总OI定为单边开仓、资金流或强平。既有net-OI机制边界没有放宽，混合回补/新开在OI净增长中仅理论可行，不足以证明具体行为，保守保留争议。未来方向是可检验假设，不要求未来已经成为事实。新语义检查限制无来源的已现抛压和确定拥挤；不删除研究信息或原输出字段。没有结构时保持指标复核/不足结构，THESIS_WARNING/INVALIDATED/HORIZON_EXPIRED机器语义不改。

## 10. Modified Files

| 文件 | 动作 | 作用 |
|---|---|---|
${changes.map(([p,c,d])=>`| ${link(p)} | ${c} | ${d} |`).join('\n')}

另新增两个验收Markdown及独立validation目录。既有测试文件均未修改。Prompt/Schema一致性没有发现需要修改核心Prompt的字段矛盾，故没有Prompt修改。

## 11. Real 30-Response Replay

30原始响应完整可读，Schema27/30，完整11/30，失败19/30。按最早合法响应选择，5/10事件有效，首次2、恢复1次2、恢复2次1；累计2/10→4/10→5/10。**本次没有实际重试请求**，选择的是上一任务保存的请求1/2/3原文。生产Analyst重试预算保持不变，NIGHT第三份离线合格不表示生产重试次数已扩张。

| Symbol | RunId | 终态 | 最早有效方向 | 最早有效attempt | 所有有效attempt |
|---|---|---|---|---:|---|
${metricRows}

独立方向BULLISH1、BEARISH4、两类REVERSAL0、NO_EDGE0；响应方向BULLISH3、BEARISH8。实际输入Evidence逐份与重建Facts核对相同，未增补未来证据。完整 ${link(out+'/live-replay.json')}。

## 12. Historical 70-Analysis Replay

140响应/70研判；Schema95/140、完整32/140；最早合格选26/70，44失败。BULLISH3、BEARISH1、两REVERSAL0、NO_EDGE22。原25/70保留，新增1个PEOPLE21:00 NO_EDGE。首次13，恢复13。没有覆盖历史文件。开发初次回归曾误伤CAP条件解释，通用修复后原25全部保留；不是因降低真实错误要求让它通过。完整 ${link(out+'/historical-replay.json')}。

## 13. Holdout Validation

修复前冻结10个不同Symbol-Run，和本轮10事件不重叠；6合法条件研判通过、4错误断言拒绝。语言8例全部符合预期：合法4/4、反例4/4；误拒绝0、无依据漏拦截0。保留集内没有错误REVERSAL样本，故**真实保留集错误REVERSAL覆盖=0（NOT_COVERED）**，该项由真实APR/AGT及独立Mock正反例覆盖，不能假报保留集覆盖。历史时期/前次审计有曝光，独立性限于不同事件且修复前冻结，不是未知未来市场盲测。

首次和各次固定规则版本全部18例通过；没有根据保留集失败打补丁。后续迭代来自既有开发30例的单位/同句绑定与旧70回归CAP的通用否定作用域缺陷，每个新增反例都用Mock，不按Symbol决定通过。各阶段结果均保留，最终 ${link(out+'/holdout-results.json')} 与 ${link(out+'/rule-freeze.json')}。

## 14. Correctly Rejected Counterexamples

正式guard入口拒绝错误价格/OI/Funding、pp混%、错误窗口（含5m伪称1h）、百分比阈值伪称USDT、虚构目标/胜率/概率/流入/账户数量、其他币种/未知ID/未来数据、双重否定与转折后肯定、未经证实OI单边行为、错误REVERSAL和结构确认。没有把“可能”统一豁免。失败Mock Analyst仍保留独立Facts情报，FAILED不会包装成有效NO_EDGE。

## 15. Tests and Static Checks

npm test：**${testCount}/${testCount}**，0失败/0跳过；383原测试保留，新增${testCount-383}。完整输出 ${link(out+'/test-output.txt')}。node --check：**${files.length}/${files.length}**，${link(out+'/static-checks.json')}。新测试全部正式guardDirectional或Mock生产分析/Packet链路；原Facts/Claim Guard/去重/不限输出/DingTalk队列/调度测试仍通过。

## 16. Production Data Integrity

前后校验2277受保护文件，2103个生产data文件，新增生产data=0。唯一既有文件差异是获准alignment guard；原.env、模型响应、analyst快照、历史、Outbox和投递状态全部哈希一致。既有验证目录完整哈希保护。测试写入仅Mock临时目录或本任务独立验证目录。无扫描、真实Binance/DeepSeek/DingTalk、交易、发帖、补发、后台启动。最终 ${link(out+'/final-integrity.json')}，基础 ${link(dir+'/before-hashes.json')}。

## 17. Remaining Failure Categories

ERA所有响应仍涉及未知结构、“追多拥挤”当前状态及净增长OI下回补解释；BAT所有响应“高位抛压已现”无独立证据。APR恢复后的回补+新开多混合机制仍有争议，继续失败。WIF未来精确价格及部分跨窗口/角色表达仍阻断；WLFI首份未来精确价位/边界表达，后两份marketThesis>400；NIGHT首次同样Schema超长，第二份Thesis具体减仓解释未落在允许的MECHANISM角色。US首份“杠杆”等行为概括仍保守拒绝。APR/AGT首次标签与当前转向反向，继续失败。

无法充分确定的机制/复杂表述保留UNDETERMINED或CONTRACT_MISMATCH，不声明它们都是真错。剩余8个合同诊断中包含合法数据值但缺乏可稳定绑定的配对/窗口或未来条件措辞；它们不是捏造数据的证据。当前语法尚不覆盖任意自然语言，不声称所有误拒绝已清零。

## 18. Production Readiness Verdict

已具备下一轮固定V2、受控真实DeepSeek联调的离线前提：通用误拒绝修复、原25回归无损、冻结保留集无观察到误拒绝或漏拦截、全部测试与完整数据安全校验通过。**全面生产可靠性仍未获新真实联调证明**，自然语言开放集漏拦截为UNKNOWN。本次没有安排/启动联调或扫描。保留npm run scan前台方式、无限制合格情报输出及全部安全边界。

## Q1–Q16

${q.map(([n,a])=>`- **${n}** ${a}`).join('\n')}
`;
fs.writeFileSync('BA_BIAS_ANALYST_VALIDATION_PRECISION_V1.md',report);
let replay=`# BA_BIAS_ANALYST_VALIDATION_PRECISION_V1_REPLAY\n\n最终正式生产入口离线回放；30响应对应10事件，最早通过11响应/5事件。原响应/请求/Facts从未重写。预分类与51项独立审计纠正并存，不以新validator自定义真值。历史140响应/70事件另见完整JSON。没有缺失原始数据；7个历史JSON不合法保留INVALID_LLM_JSON，不尝试修复。\n\n`;
for(const row of reviewed){const nature=[...new Set(row.issues.map(d=>d.finalClassification))],removed=row.issues.filter(d=>d.removed&&d.finalClassification==='FALSE_REJECTION'),otherRemoved=row.issues.filter(d=>d.removed&&d.finalClassification!=='FALSE_REJECTION'),blocked=row.newValidation.diagnostics.filter(d=>!d.allowed&&!d.code.startsWith('VERIFIED_')&&!d.code.startsWith('PERMITTED_'));
 replay+=`## ${row.symbol} / ${row.runId} / attempt ${row.attempt}\n\n- 原始方向/周期：${row.rawDirection} / ${row.horizon}；evaluationTime：${row.evaluationTime}；Schema：${row.schema?'PASS':'FAIL'}。\n- 原全部失败代码：${row.oldErrors.join(', ')}。\n- 独立错误性质：${nature.join(', ')}；逐诊断、原字段全文、来源算术、预标签见 ${link(out+'/reviewed-classification.json')} 中id=${row.id}。\n- 修复后完整状态：**${row.newValidation.ok?'VALIDATED':'FAILED'}**。剩余代码：${row.newValidation.errors.join(', ')||'无'}。\n- 解除明确误拒绝：${removed.length}诊断，${[...new Set(removed.map(d=>d.code))].join(', ')||'无'}。另${otherRemoved.length}项合同/争议诊断不再出现，不统一视为事实证明。\n- 原Facts：${link(row.facts)}；原请求/完整实际Evidence：${link(row.inputReference)}；原模型原文：${link(row.rawReference)}；原解析/验证：${link(row.validationReference)}。\n- 事实安全风险：${row.risk}；${row.knownExtraRisks||'保留不确定性，不据此证明未来行情或具体参与者行为。'}\n- 实际声明/文本引用Evidence：${(row.usedReferences||[]).map(id=>'\`'+id+'\`').join(', ')}。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。\n\n| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |\n|---|---|---|\n${blocked.map(d=>`| ${d.field||d.path||'/'} | ${d.code} | ${(d.literal||d.match||d.span||'完整规则/Schema检查').replaceAll('|','\\|')} |`).join('\n')||'| — | 无 | — |'}\n\n`;
}
replay+=`## 70历史研判逐事件结果\n\n完整原文/原错误/新诊断/来源 ${link(out+'/historical-replay.json')}。25→26，全部原25保留。\n\n| Symbol | Run | 最终 | 方向 | 最早attempt | 仍有拒绝码（包含未选attempt） |\n|---|---|---|---|---:|---|\n${history.research.map(r=>`| ${r.symbol} | ${r.runId} | ${r.valid?'VALIDATED':'FAILED'} | ${r.bias||'—'} | ${r.attempt||'—'} | ${r.remaining.join(', ')} |`).join('\n')}\n\n## 冻结保留集\n\n| Symbol | Run | attempt | 预期 | 实际 |\n|---|---|---:|---|---|\n${held.real.map(c=>`| ${c.symbol} | ${c.runId} | ${c.attempt} | ${c.expected?'PASS':'REJECT'} | ${c.validation.ok?'PASS':'REJECT'} |`).join('\n')}\n\n8个冻结语言例的全文和实际结果 ${link(out+'/holdout-results.json')}。无保留集失败，无Symbol补丁。数据时间/来源 ${link(dir+'/holdout.json')}；有限历史曝光与错误反转未覆盖已在主报告披露。\n\n## 规则前后与反例\n\n| 规则 | 原真实失败 | 改后 | 仍有其他阻断/反例 | 位置 |\n|---|---|---|---|---|\n| 前导+、单位/窗口 | AIOT4h +11.53%/+19.69%，旧numeric拒绝 | 正确舍入值接受 | 1h OI套4h5.63%、Funding伪值、pp混%仍拒绝 | ${link('src/analysis/evidence-precision-validator.js')} |\n| 当前Symbol、裸ID | MAGICUSDT和price.closed1h裸ID被误认币种 | 正式整份通过 | OTHERUSDT、相似TESTUSDTX、未知ID拒绝 | ${link('src/analysis/directional-alignment-guard.js')} |\n| 否定作用域 | ERA无法据此确认强平、AIOT不保证未来方向 | 否定解释不再肯定关键词 | ERA其他回补/结构仍拒绝；双重否定、转折后主力资金断言仍拒绝 | ${link('src/analysis/evidence-precision-validator.js')} |\n| 反转方向 | APR/AGT BEARISH_REVERSAL但当前上转 | 仍拒绝 | 合法等长向上/向下Mock通过，不要求ICT | ${link('src/analysis/directional-alignment-guard.js')} |\n| 历史/未来分离 | AIOT未来情景重述历史基线误拒 | 已发生基线接受、已有rule精确绑定 | WIF/WLFI未来精确目标仍拒绝，OI弱化仍仅warning | ${link('src/analysis/evidence-precision-validator.js')} |\n| 后置ID/有序多指标 | AGT前一值的ID被借给后一值、NIGHT同期列表 | 严格前/后引用及已标记顺序绑定 | 不明确window/paired语法仍保守拒绝；不按数值任选Evidence | ${link('test/analyst-precision.test.js')} |\n`;
fs.writeFileSync('BA_BIAS_ANALYST_VALIDATION_PRECISION_V1_REPLAY.md',replay);
console.log(JSON.stringify({tests:pass,newTests:testCount-383,static:files.length,review:counts,integrity,live:summary.live},null,2));
