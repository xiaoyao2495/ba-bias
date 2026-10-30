import {createHash} from 'node:crypto';
export const TREND_SIMPLE_CONFIG=Object.freeze({timeframe:'5m',schedule:{minutes:[0,15,30,45],delaySeconds:10},candles:{intervalMinutes:5,intervalMs:300000,historyBars:300,minimumWarmupBars:200,closedOnly:true},pivot:{method:'FRACTAL',leftBars:2,rightBars:2},indicators:{emaFast:20,emaSlow:50,emaSlopeLookbackBars:4,adxPeriod:14,adxTrendThreshold:20,erPeriod:20,erDirectionalThreshold:0.30,atrPeriod:14,priceChangeWindowBars:20,emaPositionWindowBars:8,emaPositionMinBars:5},structure:{maxLastPivotAgeBars:16,breakConfirmation:'CLOSE'},universe:{usdtPerpetualOnly:true,nativeCryptoOnly:true,minQuoteVolume24hUsdt:10000000},selection:{topK:3,bullishOnly:true},llm:{maxSymbolsPerRound:3,maxAttemptsPerSymbol:1,concurrency:2,allowedBias:['BULL','BEAR','NEUTRAL']},trading:{enabled:false}});
export const INTERVAL=TREND_SIMPLE_CONFIG.candles.intervalMs;
export const DATA_NAMESPACE='trend-simple-5m-v1';
export const hash=x=>createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
export const CONFIG_HASH=hash(TREND_SIMPLE_CONFIG);
