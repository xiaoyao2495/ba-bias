// Raw synthetic sources only. No network, Scanner startup, credentials or production state.
import Big from 'big.js';
import {fixture,identity} from './fixtures.js';
import {buildFacts} from '../src/market/facts-engine.js';
import {detect} from '../src/market/detector.js';
import {endpoints} from '../src/clients/binance.js';
export function precisionSource({symbol='TESTUSDT',price=0,price1h=0,oi=0,funding=0,volume=1,accountShift=0}={}){
 let x=fixture();x=JSON.parse(JSON.stringify(x).replaceAll(x.symbol,symbol));x.identity.baseAsset=symbol.slice(0,-4);
 x.sources.exchange={endpoint:endpoints.exchange,params:{},raw:{...identity,symbol,baseAsset:symbol.slice(0,-4)}};
 Object.assign(x.ticker,{lastPrice:new Big(100).plus(price).toString(),openPrice:'100',priceChangePercent:String(price),highPrice:String(Math.max(100,100+Number(price))),lowPrice:String(Math.min(100,100+Number(price)))});x.sources.ticker.raw=x.ticker;
 for(const k of [...x.sources.hour.raw,...x.sources.five.raw]){for(const i of [1,2,3,4])k[i]='100';k[5]='100';}
 Object.assign(x.sources.hour.raw.at(-1),{4:new Big(100).plus(price1h).toString(),2:String(Math.max(100,100+Number(price1h))),3:String(Math.min(100,100+Number(price1h))),5:new Big(100).times(volume).toString()});
 for(const r of x.sources.oi.raw)r.sumOpenInterest='100';x.sources.oi.raw.at(-1).sumOpenInterest=new Big(100).plus(oi).toString();
 for(const r of x.sources.funding.raw)r.fundingRate='0';x.sources.funding.raw.at(-1).fundingRate=new Big(funding).div(100).toString();
 x.sources.premium.raw.lastFundingRate='0';
 const end=Math.floor(x.cutoff/3600000)*3600000;
 x.sources.accounts={endpoint:endpoints.accounts,params:{symbol,period:'1h',limit:30,endTime:x.cutoff},raw:Array.from({length:30},(_,i)=>{const l=i===29?new Big('.5').minus(new Big(accountShift).div(100)):new Big('.5'),s=new Big(1).minus(l);return {symbol,timestamp:end-(29-i)*3600000,longAccount:l.toString(),shortAccount:s.toString(),longShortRatio:l.div(s).toString()};})};
 return x;
}
export const precisionFacts=o=>detect(buildFacts(precisionSource(o)));
export function precisionMarket(rows,{failure,delayHourMs=0,parentSignal}={}){
 const sources=new Map(rows.map(r=>[r.symbol,precisionSource(r)])),calls=[];
 return {http:{signal:parentSignal},calls,async get(endpoint,params={}){calls.push({endpoint,params});const first=sources.values().next().value,x=sources.get(params.symbol)||first;
  if(failure?.(endpoint,params))throw Object.assign(Error('MOCK_SOURCE_FAILURE'),{code:'MOCK_SOURCE_FAILURE'});
  let raw;if(endpoint===endpoints.time)raw={serverTime:first.cutoff};else if(endpoint===endpoints.exchange)raw={symbols:rows.map(r=>({...sources.get(r.symbol).sources.exchange.raw,...r.identity})),rateLimits:[]};else if(endpoint===endpoints.ticker)raw=rows.map(r=>({...sources.get(r.symbol).ticker,...r.ticker}));else if(endpoint===endpoints.premium)raw=rows.map(r=>sources.get(r.symbol).sources.premium.raw);else if(endpoint===endpoints.fundingInfo)raw=[];else if(endpoint===endpoints.klines){if(delayHourMs&&params.interval==='1h'){await new Promise(resolve=>setTimeout(resolve,delayHourMs));}raw=params.interval==='1h'?x.sources.hour.raw:x.sources.five.raw;}else if(endpoint===endpoints.oi)raw=x.sources.oi.raw;else if(endpoint===endpoints.funding)raw=x.sources.funding.raw;else if(endpoint===endpoints.accounts)raw=x.sources.accounts.raw;else raw=[];
  return {endpoint,params,raw:structuredClone(raw)};
 }};
}
