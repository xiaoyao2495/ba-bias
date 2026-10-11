// Presentation only. Canonical evidence, arithmetic, thresholds and validators stay unchanged.
import {directionalInput} from './directional-context.js';
import {directionalSchemaV2,validateInput,BIASES,HORIZONS,OPPORTUNITIES} from './directional-schema.js';
export const GENERATION_VERSION='DIRECTIONAL_ANALYST_GENERATION_V3';
export const INPUT_FORMAT_VERSION='DIRECTIONAL_INPUT_PRESENTATION_V3';
export const VALIDATOR_VERSION='DIRECTIONAL_ANALYST_V2_PRECISION_V1';
export const fieldRoles={
  version:'固定DIRECTIONAL_ANALYST_V2，不复制输入容器version。',symbol:'原样复制研究对象。',evaluationTime:'原样复制评价时间。',
  marketBias:'未来horizon的定性方向假设，不是历史涨跌标签。',horizon:'从1h/4h/24h选择有证据的未来研究期限。',horizonReason:'说明为何选此周期；引用该周期价格/OI，不罗列全部背景。',
  conviction:'定性证据强度LOW/MODERATE/HIGH，不是概率。',marketThesis:'FORECAST_HYPOTHESIS：一句方向倾向、主要依据和主要限制；不重复全部数字、不声称参与者行为已发生。',
  marketMechanism:'MECHANISM：只解释一个有同期价格/OI依据的可能机制；无法区分具体开平仓时明确未知。',
  supportingEvidenceIds:'选择真正支持论点的已有ID；含所选周期价格，OI可用且对齐时一并考虑。反转须含此前等长价格ID。',
  conflictingEvidenceIds:'选择不利事实的已有ID；确实无冲突可为[]，不为凑数把支持写成冲突。',
  tradeOpportunity:'独立评估可执行性；方向明确也可等待或无setup。',preferredScenario:'未来horizon内主假设如何演变，定性可观察；当前快照价不是未来目标价。',
  invalidation:'对象type/ruleIds/description：用真实规则或定性复核或结构不足，不造结构点位。',
  alternativeScenario:'竞争性未来情景及触发重新评估的变化；与preferredScenario分工。',followUpChecks:'1至2个简短后续核对点，不重述整份研判。'
};
export const outputGuide={version:'DIRECTIONAL_ANALYST_V2',required:directionalSchemaV2.required,fieldRoles,
  biases:BIASES,horizons:HORIZONS,opportunities:OPPORTUNITIES,
  textLimits:{minLength:1,maxLength:400,recommendedLength:160,followUpMinItems:1,followUpMaxItems:2,supportMinItems:1,evidenceMaxItems:128,ruleMaxItems:2},
  emptyPolicy:'必填文字不可为空；conflictingEvidenceIds可[]；定性复核及结构不足ruleIds可[]。不增字段。'};
export const generationRules=`${GENERATION_VERSION}。你是独立未来行情方向研究员；对已确认事实提出有期限、有竞争情景的研究假设，不否决已合格事实新闻。输出DIRECTIONAL_ANALYST_V2严格JSON，version固定为DIRECTIONAL_ANALYST_V2，使用输入contractVersion，不复制输入容器version；direction字段实际名marketBias。遵守Schema全部必填字段，不添加extraNotes或解释字段。先读contentContract，再看evidenceGuide分类索引，最终数值和来源以evidence为准。
OBSERVATION：仅引用输入Registry已有Evidence ID，不拼接ID。优先用{{evidenceId}}，程序Renderer确定性展示精确数值；支持/冲突列表选论据，背景引用可不在列表但必须在Registry。不需要在每个文字字段复写百分比。若手写数字，必须保留指标、单位、正负号、舍入、时间窗口和口径。当前快照、滚动24h、已收盘窗口、此前等长窗口分别表达；跨周期逐一标记，不当作同期。dataTimes不得超过evaluationTime；缺失不等于中性。
MECHANISM只放marketMechanism：同期价格与OI合约数量变化允许解释统计组合。OI增加表示合约规模扩张，不证明单侧加仓或资金流入；OI收缩且价格上涨才可提出与部分空头回补的可能性相容，价格下降/OI收缩可提出与部分多头敞口了结的可能性相容，均不能确认具体行为。OI增加不单凭Funding推断回补。不要在marketThesis把拥挤、抛压、获利了结等参与者状态写成已证实事实；否定说明须紧邻断言，不能用末尾免责声明掩盖前文确定性因果。账户比例不是持仓比例；顶部账户与顶部持仓分开，顶部持仓份额也不是全市场OI多空占比。正已结算Funding多头支付空头，负已结算Funding空头支付多头，支付关系须引用真实最新结算ID；相邻结算变化用百分点，不假设相同结算周期。
FORECAST_HYPOTHESIS：marketThesis明确未来所选horizon的倾向及限制；preferredScenario描述主情景，alternativeScenario描述竞争情景。不把未来当已证明事实；禁止精确目标价、胜率、概率、收益率和虚构结构。不要因预测不确定就一律NO_EDGE，也不强迫选择明确方向或固定方向分布。与当前价格相反的假设须有明确冲突及参与量依据。
方向：BULLISH/BEARISH是有依据的向上/向下延续假设。BULLISH_REVERSAL须此前同长度价格负、当前正；BEARISH_REVERSAL须此前同长度正、当前负；引用两端价格ID，解释真实转向，不能只因大涨大跌、Funding极端、账户多数或账户翻转选REVERSAL。不需要未接入ICT/MSS/BOS/FVG，也不得称结构反转已确认。NO_EDGE须解释真实冲突或不足，不用继续观察逃避有依据判断。
方向与交易机会独立：BULLISH可WAIT_FOR_PULLBACK/AVOID_CHASING，BEARISH可WAIT_FOR_CONFIRMATION/NO_ACTIONABLE_SETUP。当前priceStructure=false，不得LONG_SETUP/SHORT_SETUP，不造入场止损目标。缺少对齐OI必须LOW；HIGH仍须所选1h有strongContinuation、当前价格方向与预测一致、对齐OI扩张，相对1h量至少2倍且引用其ID，无冲突ID且其他当前价格周期不反向，定性强度不等于胜率。
invalidation优先真实结构，但当前无结构不能PRICE_STRUCTURE_INVALIDATION。OBSERVABLE_CONDITION只选择当前horizon输入rules，价格规则INVALIDATED、OI规则THESIS_WARNING；规则须与预测方向相符，不能把当前上涨的相反规则用于相反预测。引用ruleId，不自造数值；OI逆转仅复核。无适用规则可METRIC_BASED_REASSESSMENT且ruleIds=[]，定性写后续同期价格/OI改变时复核，不自动INVALIDATED；无法构造复核条件可INSUFFICIENT_STRUCTURE_DATA且ruleIds=[]，明确缺失。HORIZON_EXPIRED由程序处理，不新增输出类型。
字段职责见contentContract.outputContract.fieldRoles：每字段一个主要判断，建议160字符以内、正式每文字1至400字符；不写主力/庄家/聪明钱故事，不要求填满长度。followUpChecks必须1至2项；支持1至128个已有ID、冲突0至128个，去重；invalidation.ruleIds最多2个。输出前核对版本/对象/时间、字段长度、周期、ID、反转符号与失效规则；仍须通过完整正式验证。`;
export const recoveryRules=`受控恢复：上一份输出未通过正式合同。阅读repairErrors全部代码、contractRepair.preciseErrors完整诊断和contentContract.recovery中的逐字段指引，逐项修复后重新生成完整Schema对象。保持原始观察事实和evaluationTime不变，不编造缺失数据、不删除必填字段。合法ID只从contractRepair.allowedEvidenceIds选择；原响应不是事实来源。原方向缺依据时可以重新选择有依据方向或NO_EDGE，但不按固定模板强制改方向。检查未报错字段也未引入新数字、新结构或超长；恢复后仍执行全部验证器，不保证通过。`;
function category(e){const id=e.evidenceId.split(':').slice(1).join(':');return id.startsWith('price.')||id.startsWith('directional.price.')?'PRICE':id.startsWith('oi.')?'OI_QUANTITY':id.startsWith('funding.')?'FUNDING':id.startsWith('volume.')?'VOLUME':id.startsWith('global.')?'GLOBAL_ACCOUNTS':id.startsWith('topAccounts.')?'TOP_TRADER_ACCOUNTS':id.startsWith('topPositions.')?'TOP_TRADER_POSITIONS':id==='topGlobal.divergence'?'TOP_GLOBAL_ACCOUNTS_DIVERGENCE':'OTHER_VERIFIED';}
export function evidenceDisplay(e){
  const group=category(e),id=e.evidenceId;
  const unit=/\.change(?:\d+h)?$/.test(id)||id.endsWith(':funding.change')||id.includes('divergence')?'PERCENTAGE_POINTS':id.includes('.flip')?'DOMINANCE_STATUS':id.includes('volume.relative')?'MULTIPLE_OF_PREVIOUS_24_BARS':id.includes('volume.')||id.endsWith(':price.last')?'USDT':group==='OTHER_VERIFIED'?'SEE_VERIFIED_PHRASE':'PERCENT';
  return {evidenceId:id,group,metric: id.slice(id.indexOf(':')+1),unit,scope:e.scope,
    observationWindow:id.includes('previous')?'PREVIOUS_EQUAL_LENGTH_CLOSED_WINDOW':id.includes('rolling')?'ROLLING_WINDOW':id.includes('closed')?'CLOSED_WINDOW':id.includes('relative')?'CLOSED_BAR_VS_PREVIOUS_24_BARS':group==='FUNDING'?'ACTUAL_SETTLEMENT_TIMES':id.includes('.latest')?'LATEST_SAMPLE':'SEE_VERIFIED_PHRASE',
    window:e.window??(id.endsWith(':volume.relative5m')?'5m':id.endsWith(':volume.closed1h')?'1h':null),samplingPeriod:e.params.period??e.params.interval??null,
    dataTimes:e.dataTimes,meaning:e.phrase,value:e.result,source:e.endpoint};
}
export function generationInput(f){
  const canonical=directionalInput(f,{contractVersion:'DIRECTIONAL_ANALYST_V2'});
  const displays=canonical.evidence.map(evidenceDisplay),groups=Object.fromEntries(['PRICE','OI_QUANTITY','FUNDING','VOLUME','GLOBAL_ACCOUNTS','TOP_TRADER_ACCOUNTS','TOP_TRADER_POSITIONS','TOP_GLOBAL_ACCOUNTS_DIVERGENCE','OTHER_VERIFIED'].map(g=>[g,displays.filter(e=>e.group===g)]));
  const visibleIds=new Set(canonical.evidence.map(e=>e.evidenceId));
  const contentContract={generationVersion:GENERATION_VERSION,inputFormatVersion:INPUT_FORMAT_VERSION,validatorVersion:VALIDATOR_VERSION,
    research:{symbol:canonical.symbol,evaluationTime:canonical.evaluationTime,horizons:HORIZONS,
      anomalies:(f.anomalies||[]).map(a=>({kind:a.kind,evidenceIds:(a.evidenceIds||[]).filter(id=>visibleIds.has(id))})),
      horizonEvidence:canonical.windows,missing:canonical.unavailable},...canonical.contentContract,outputContract:outputGuide};
  const input={version:canonical.version,contractVersion:canonical.contractVersion,symbol:canonical.symbol,evaluationTime:canonical.evaluationTime,
    contentContract,evidenceGuide:{...canonical.evidenceGuide,groups},evidence:canonical.evidence,windows:canonical.windows,
    entryReference:canonical.entryReference,capabilities:canonical.capabilities,rules:canonical.rules,unavailable:canonical.unavailable};
  if(!validateInput(input))throw Error('DIRECTIONAL_GENERATION_INPUT_INVALID');return input;
}
function guidance(d){
  const code=d.code||String(d);if(code.includes('SCHEMA'))return '按schemaErrors.instancePath修复必填、枚举或长度；每文字1..400，减少数字复写，仍生成完整对象。';
  if(/REVERSAL|BIAS|FORECAST/.test(code))return '复核所选周期当前及此前等长价格的符号、转向证据和竞争情景；不强制NO_EDGE。';
  if(/NUMBER|NUMERIC|WINDOW|ALIGNED/.test(code))return '核对诊断literal/field与Registry的单位、周期、dataTimes；优先真实ID占位符，不把快照变成未来目标。';
  if(/INVALIDATION|RULE|STRUCTURE|UNAVAILABLE/.test(code))return '只选当前周期真实适用rules；无结构不得编造点位，可使用空ruleIds的定性复核或结构不足。';
  if(/EVIDENCE|SYMBOL|REFERENCE/.test(code))return '仅复制allowedEvidenceIds中的完整ID和原symbol，不构造或借用其他指标ID。';
  if(/CAUSE|PARTICIPANT|INTENT|SCOPE|FUNDING/.test(code))return '区分观察与可能机制；机制仅在marketMechanism且须同期价格/OI支持，不能确认开平仓、资金流、拥挤或抛压。核对账户/持仓和Funding支付方向。';
  return '根据完整诊断复核该字段与正式Schema/事实约束，不把错误字段简单删除。';
}
export function recoveryInput(input,last){
  const errors=last.errors||[],diagnostics=last.diagnostics??errors;
  const targets=diagnostics.map(d=>({diagnostic:d,guidance:guidance(d)}));
  const result={...input,contentContract:{...input.contentContract,recovery:{targets,allErrorCodes:errors,fieldRoles,allowedRules:input.rules,immutableFacts:'evidence、symbol、evaluationTime均保持原始值；修复输出而非改写事实。'}},
    repairErrors:errors,contractRepair:{originalInput:input,originalResponse:last.raw??null,preciseErrors:diagnostics,allowedEvidenceIds:input.evidenceGuide.allowedEvidenceIds,mustFix:'逐字段修复全部诊断，重新生成完整V2对象；不新增事实/ID/结构，不把原响应当证据；可重新研究方向，但仍执行完整验证。'}};
  if(!validateInput(result))throw Error('DIRECTIONAL_RECOVERY_INPUT_INVALID');return result;
}
