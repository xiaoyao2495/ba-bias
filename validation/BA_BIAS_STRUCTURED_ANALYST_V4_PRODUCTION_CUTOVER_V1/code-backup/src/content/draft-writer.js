import {marketRules,llmFacts} from './story-judge.js';
import {validateDraft,draftSchema} from './schemas.js';
export async function writeDraft(llm,f,judge,repair=null){
  const allowed=judge.keyEvidenceIds.slice(0,4);
  for(const e of f.evidence){if(allowed.length>=2)break;if(!allowed.includes(e.evidenceId))allowed.push(e.evidenceId);}
  const inputFacts=llmFacts(f);inputFacts.evidence=inputFacts.evidence.filter(e=>allowed.includes(e.evidenceId));inputFacts.anomalies=[];
  const draft=await llm.json(marketRules+`写一篇中文币安广场待人工审核短文，约120-240中文字，自然简短，以2-4个证据为核心，风格可变化，不编造个人经历、不保证方向或收益。输出JSON字段symbol,storyType,title,body,observation,evidenceIds。symbol与输入一致，storyType与judge一致。title/body/observation中的交易对必须写{{symbol}}。任何数字、价格、百分比、时间窗口、Funding支付方向、账户比例、OI变化必须通过占位符{{完整evidenceId}}插入完整程序证据句，严禁手写数字（包括中文数词时间/比例）或重新表述这些数值事实。evidenceIds只选2-4个，至少包含judge的一个关键证据，所有选中证据均在正文中引用一次。观察点可用定性语言描述未来需要观察什么。只允许allowedEvidenceIds中的占位符，所有正文引用必须与evidenceIds完全一致。请勿重复写证据句自带的‘不代表资金净流入/多空加仓’等警示；这些警示由程序插入。title/observation使用纯定性文字，不要手写24小时等数字。正文只插入证据句，不重复解释涨跌幅或付款方向。严格遵守此JSON Schema：${JSON.stringify(draftSchema)}。如果提供repair，修复其中所有错误，只允许这一次修稿。`,{facts:inputFacts,judge:{storyType:judge.storyType,storyAngle:judge.storyAngle},allowedEvidenceIds:allowed,repair});
  if(!validateDraft(draft))throw new Error('DRAFT_SCHEMA_INVALID');return draft;
}
