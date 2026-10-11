import {validateDraft} from './schemas.js';
const forbidden=/主力|庄家|聪明钱|强平|爆仓|净流入|净流出|资金流入|资金流出|多头加仓|空头加仓|主动平仓|持续加仓|获利了结|新空头入场|新多头入场|趋势.{0,8}(确认|反转)|价格.{0,8}(即将|必然).{0,5}(反转|上涨|下跌)|散户|内幕|公告|上市|上线|团队|融资|合作|空投|稳赚|必涨|必跌|一定上涨|一定下跌|保证收益|我曾|我买|我卖|我持仓/;
export function guardDraft(draft,f,judge){
  const errors=[];
  if(!validateDraft(draft))return {ok:false,errors:['DRAFT_SCHEMA_INVALID']};
  if(draft.symbol!==f.symbol || draft.storyType!==judge.storyType)errors.push('SYMBOL_OR_STORY_TYPE_MISMATCH');
  if(!f.dataCompleteness.eligible)errors.push('INCOMPLETE_FACTS');
  if(!draft.evidenceIds.some(id=>judge.keyEvidenceIds.includes(id)))errors.push('JUDGE_KEY_EVIDENCE_NOT_USED');
  const map=new Map(f.evidence.map(e=>[e.evidenceId,e]));
  const template=[draft.title,draft.body,draft.observation].join('\n');
  const refs=[...template.matchAll(/\{\{([^{}]+)\}\}/g)].map(m=>m[1]);
  for(const id of draft.evidenceIds){const e=map.get(id);
    if(!e)errors.push('UNKNOWN_EVIDENCE:'+id);
    else if(!e.dataTimes?.length||e.dataTimes.some(t=>!Number.isSafeInteger(t.ms)||t.ms>f.dataCutoff))errors.push('FUTURE_OR_INVALID_EVIDENCE:'+id);
    if(!draft.body.includes('{{'+id+'}}'))errors.push('EVIDENCE_NOT_IN_BODY:'+id);
  }
  for(const ref of refs)if(ref!=='symbol' && !draft.evidenceIds.includes(ref))errors.push('UNDECLARED_PLACEHOLDER:'+ref);
  const prose=template.replace(/\{\{[^{}]+\}\}/g,'');
  if(/[{}]/.test(prose))errors.push('MALFORMED_PLACEHOLDER');
  if(/[0-9０-９%％]|[零〇一二两三四五六七八九十百千万亿半]+\s*(小时|分钟|天|日|周|月|年|成|倍|元|美金|USDT|%|％)|百分之|千分之/.test(prose))errors.push('UNTRUSTED_NUMBER_OR_WINDOW');
  if(forbidden.test(prose))errors.push('UNSUPPORTED_SEMANTIC_CLAIM');
  if(/支付|付给|账户.{0,20}(仓位|资金|持仓)|OI.{0,20}(代表|说明|意味)|持仓.{0,12}(多头|空头)/i.test(prose))errors.push('UNSUPPORTED_DIRECTION_OR_RATIO_CLAIM');
  if(/\b[A-Z][A-Z0-9]{1,15}\b/.test(prose.replace(/OI|USDT|Funding/g,'')))errors.push('UNTRUSTED_ASSET_SYMBOL');
  if(errors.length)return {ok:false,errors};
  const render=s=>s.replace(/\{\{([^{}]+)\}\}/g,(_,id)=>id==='symbol'?f.symbol:map.get(id).phrase);
  const article={symbol:f.symbol,storyType:draft.storyType,title:render(draft.title),body:render(draft.body),observation:render(draft.observation),evidenceIds:draft.evidenceIds,template:draft};
  article.text=`${article.title}\n\n${article.body}\n\n后续观察：${article.observation}`;
  if(article.body.length<30 || article.body.length>1600)return {ok:false,errors:['ARTICLE_LENGTH_INVALID']};
  return {ok:true,errors:[],article};
}
