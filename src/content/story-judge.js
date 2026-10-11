import {validateJudge,judgeSchema} from './schemas.js';
import {config} from '../config.js';
export const marketRules=`你是独立市场研究编辑。只使用输入事实，不访问外部信息。不推断项目全名、新闻、主力、庄家、聪明钱、强平、资金净流入、持仓多空方向。OI仅为数量，账户比例不是仓位/资金比例。正Funding多头支付空头，负Funding空头支付多头。展示费率不是历史结算。缺失事实不能补齐。分析假设要用可能/需要观察。多空比例变化单位为百分点。TOP_TRADER_ACCOUNTS是顶部账户分布，TOP_TRADER_POSITIONS是顶部持仓份额，不能解释为全市场OI多空占比。账户变化不能证明持续加仓、获利了结、新空头入场或趋势反转；顶部与全市场背离不能预测价格反转。单点翻转与连续样本确认必须区分。账户分布异常可独立具有新闻价值，同时交叉核对同期价格、OI、成交量以及精确采样时间。必须返回严格JSON。`;
export const llmFacts=f=>({schemaVersion:f.schemaVersion,symbol:f.symbol,evaluationTime:f.evaluationTime,identity:f.identity,anomalies:f.anomalies,warnings:f.warnings,dataCompleteness:f.dataCompleteness,longShort:f.longShort,price:f.price,openInterest:f.openInterest,volume:f.volume,evidence:f.evidence.map(({evidenceId,result,phrase,dataTimes,formula,endpoint,params,scope,sources,retrievedAt})=>({evidenceId,result,phrase,dataTimes,formula,endpoint,params,scope,sources,retrievedAt}))});
export function inspectJudgeContract(result){
  const valid=validateJudge(result),errors=valid?[]:structuredClone(validateJudge.errors);
  const angleOnly=!valid&&errors.length===1&&errors[0].keyword==='required'&&errors[0].params.missingProperty==='storyAngle';
  return {valid,errors,recoveryStatus:valid?'VALID':angleOnly?'REQUIRES_LLM_RETRY':'NOT_RECOVERABLE',angleOnly};
}
function failure(code,diagnostics){const e=new Error(code);e.diagnostics=diagnostics;return e;}
export async function judgeStory(llm,f,comparison){
  if(!f.dataCompleteness.eligible || !f.anomalies.length)throw new Error('INELIGIBLE_FACTS');
  let result=await llm.json(marketRules+`判断异常是否有足够新闻价值，勿凑稿。newsworthinessScore为0-100，通过阈值${config.storyThreshold}。storyType必须等于输入comparison.storyType。返回字段eligible(boolean),storyType,newsworthinessScore,reason,keyEvidenceIds(只选2-4个最有新闻价值的证据ID，不要列出全部指标，最多12个),risks(最多12个字符串数组),storyAngle(string，必填且非空，最长1000字符，说明本次事实事件的核心报道角度，不得用固定异常模板代替)。严格按此JSON Schema输出：${JSON.stringify(judgeSchema)}`, {facts:llmFacts(f),comparison});
  const first=inspectJudgeContract(result),diagnostics={stage:'CONTRACT',raw:structuredClone(result),attempts:[{attempt:1,stage:'CONTRACT',errors:first.errors}],recoveryStatus:first.recoveryStatus};
  if(first.angleOnly){
    // Only fill the missing narrative field. The first decision, score, evidence
    // and risks are immutable; this is not a second newsworthiness judgement.
    try{
      const angle=await llm.json(marketRules+'仅修复原响应遗漏的storyAngle。根据原始决定和已验证事实说明事件核心叙事；不得重新评分、修改eligible或添加任何其他字段。只返回严格JSON {"storyAngle":"非空报道角度"}，最长1000字符。',
        {facts:llmFacts(f),comparison,originalResponse:structuredClone(result),contractErrors:first.errors});
      diagnostics.repairRaw=structuredClone(angle);
      if(!angle||Array.isArray(angle)||Object.keys(angle).length!==1||typeof angle.storyAngle!=='string'||!angle.storyAngle.trim()||angle.storyAngle.length>1000)throw new Error('JUDGE_ANGLE_REPAIR_INVALID');
      result={...result,storyAngle:angle.storyAngle};
      const repaired=inspectJudgeContract(result);
      diagnostics.attempts.push({attempt:2,stage:'ANGLE_REPAIR',raw:structuredClone(angle),errors:repaired.errors});
      if(!repaired.valid)throw new Error('JUDGE_ANGLE_REPAIR_INVALID');
      diagnostics.recoveryStatus='RECOVERED';
    }catch(e){diagnostics.recoveryStatus='REPAIR_EXHAUSTED';diagnostics.failureCode=e.message==='JUDGE_ANGLE_REPAIR_INVALID'?e.message:'JUDGE_ANGLE_REPAIR_REQUEST_FAILED';if(diagnostics.attempts.at(-1).attempt===2)Object.assign(diagnostics.attempts.at(-1),{stage:'ANGLE_REPAIR_FAILED',error:diagnostics.failureCode});else diagnostics.attempts.push({attempt:2,stage:'ANGLE_REPAIR_FAILED',error:diagnostics.failureCode});throw failure('JUDGE_SCHEMA_INVALID',diagnostics);}
  }else if(!first.valid)throw failure('JUDGE_SCHEMA_INVALID',diagnostics);
  if(result.eligible && (!Array.isArray(result.keyEvidenceIds)||!result.keyEvidenceIds.length))throw failure('JUDGE_KEY_EVIDENCE_REQUIRED',diagnostics);
  if(result.storyType!==comparison.storyType || result.keyEvidenceIds.some(id=>!f.evidence.some(e=>e.evidenceId===id)))throw failure('JUDGE_EVIDENCE_OR_TYPE_INVALID',diagnostics);
  if(result.newsworthinessScore<config.storyThreshold)result.eligible=false;
  diagnostics.stage='COMPLETE';
  // Keep the strict model output schema unchanged; persist diagnostics separately.
  Object.defineProperty(result,'contractValidation',{value:diagnostics,enumerable:false});
  return result;
}
