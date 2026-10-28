import {validateCandles} from './candles.js';
import {indicators} from '../trend-v1/indicators.js';
import {structureAt} from './structure.js';
import {hash,CONFIG_HASH,INTERVAL} from './config.js';
export function buildFacts(symbol,rows,evaluationTime,{minimum=200}={}){const bars=validateCandles(rows,evaluationTime,{minimum}),series=indicators(bars),i=series.at(-1),structure=structureAt(bars);let indicatorPath='INSUFFICIENT_INDICATORS';
 if([i.ema20,i.ema50,i.ema20Slope4,i.plusDI14,i.minusDI14,i.adx14,i.er20,i.netChange20,i.barsCloseAboveEma20Last8,i.barsCloseBelowEma20Last8].every(Number.isFinite)){
  indicatorPath='MIXED_INDICATORS';const common=i.adx14>=20&&i.er20>=0.30;
  if(common&&i.ema20>i.ema50&&i.ema20Slope4>0&&i.plusDI14>i.minusDI14&&i.netChange20>0&&i.barsCloseAboveEma20Last8>=5)indicatorPath='BULLISH_INDICATORS';
  if(common&&i.ema20<i.ema50&&i.ema20Slope4<0&&i.minusDI14>i.plusDI14&&i.netChange20<0&&i.barsCloseBelowEma20Last8>=5)indicatorPath='BEARISH_INDICATORS';}
 const ids={PRICE_5M:{value:bars.at(-1).close/bars.at(-1).open-1},INDICATORS:{value:i},STRUCTURE:{value:structure.path},INDICATOR_PATH:{value:indicatorPath}};
 for(const [path,id] of [['BULLISH_INDICATORS','INDICATORS_BULLISH'],['BEARISH_INDICATORS','INDICATORS_BEARISH']])if(indicatorPath===path)ids[id]={value:path};
 for(const [path,id] of [['BULLISH_STRUCTURE','STRUCTURE_BULLISH'],['BEARISH_STRUCTURE','STRUCTURE_BEARISH']])if(structure.path===path)ids[id]={value:path};
 for(const p of structure.rawPivots)ids[p.id]={value:p,availableAt:p.confirmedAt};for(const e of structure.events)ids[`BREAK_${e.referencePivotId}`]={value:e,availableAt:e.eventTime};
 for(const v of Object.values(ids))v.availableAt??=evaluationTime;
 return {version:'TREND_SIMPLE_5M_V1',factsVersion:'TREND_SIMPLE_5M_FACTS_1',symbol,timeframe:'5m',evaluationTime,candleIntervalEnd:evaluationTime,configHash:CONFIG_HASH,inputDataHash:hash(bars),price:bars.at(-1).close,priceChange5m:ids.PRICE_5M.value,indicators:i,indicatorHistory:series.slice(-8).map((v,n)=>({intervalEnd:evaluationTime-(7-n)*INTERVAL,...v})),indicatorPath,structure,structurePath:structure.path,factIds:ids,dataQuality:'VALID'};}
export function qualifies(f,active=false){return active||/^(BULLISH|BEARISH)_/.test(f.structurePath)||/^(BULLISH|BEARISH)_/.test(f.indicatorPath);}
