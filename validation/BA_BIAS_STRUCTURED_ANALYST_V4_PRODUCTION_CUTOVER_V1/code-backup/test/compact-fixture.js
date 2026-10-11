// Mock research fixture; no external requests. WIF is a read-only saved record.
import fs from 'node:fs';
import {fixture} from './fixtures.js';
import {buildFacts} from '../src/market/facts-engine.js';
import {detect} from '../src/market/detector.js';
import {compare,summary} from '../src/storage/history.js';
import {buildIntelligence} from '../src/intelligence/packet.js';
import {directionalInput} from '../src/analysis/directional-context.js';
import {guardDirectional} from '../src/analysis/directional-analyst.js';
import {mockDirectional} from './directional-fixture.js';
export function mockCompact({sign=1,flat=false,material=false}={}){
  const x=fixture();x.ticker.lastPrice=flat?'100':sign>0?'110':'90';x.ticker.priceChangePercent=flat?'0':sign>0?'10':'-10';
  for(const b of x.sources.hour.raw)b[4]=x.ticker.lastPrice;
  if(flat)for(const r of x.sources.oi.raw)r.sumOpenInterest='100';
  const f=detect(buildFacts(x)),input=directionalInput(f),analysis=mockDirectional(input),check=guardDirectional(analysis,input);
  if(!check.ok)throw Error(check.errors.join(','));
  const prior=material?mockCompact({sign:-sign}):null;
  const previous=prior?{summary:summary(prior.facts),runId:'MOCK_PREVIOUS',evidenceIds:prior.intelligence.evidenceIds,directional:prior.intelligence.directional}:null;
  const c=compare(f,previous);
  if(c.eligible&&previous?.directional?.status==='VALIDATED'&&previous.directional.analysis.horizon===analysis.horizon&&previous.directional.analysis.marketBias!==analysis.marketBias)c.reason='MATERIAL_EVIDENCE_AND_DIRECTION_CHANGE';
  const judge={eligible:true,storyType:c.storyType,newsworthinessScore:80,keyEvidenceIds:f.evidence.slice(0,2).map(e=>e.evidenceId)};
  const {packet}=buildIntelligence(f,judge,c,{directional:{status:'VALIDATED',analysis,rendered:check.rendered}});
  return {runId:material?'MOCK_MATERIAL':'MOCK_VALID_DIRECTION',symbol:f.symbol,intelligence:packet,approval:{judgeEligible:true,intelligenceGuardPassed:true},delivery:{status:'PENDING',sent:false},facts:f};
}
export const wifRecord=()=>JSON.parse(fs.readFileSync(new URL('../data/outbox/hourly_20261010_2100_WIFUSDT.json',import.meta.url)));
