// TEST FIXTURE: synthetic prices, times and contracts; never live market history.
export const symbol='TESTUSDT',cutoff=Date.UTC(2026,9,10,4,30);
export const identity={symbol,baseAsset:'TEST',quoteAsset:'USDT',underlyingType:'COIN',underlyingSubType:['DEFI'],status:'TRADING',contractType:'PERPETUAL'};
export function candle(open,ms,price='100',end='110',volume='10'){return [open,price,'120','90',end,volume,open+ms-1,'1000'];}
export function fixture(){
  const hour=Array.from({length:30},(_,i)=>candle(Date.UTC(2026,9,9,22)+i*3600000,3600000));
  // Anchor last hourly bar at 03:00-04:00 UTC on cutoff day.
  for(let i=0;i<hour.length;i++){hour[i][0]=Date.UTC(2026,9,10,4)-(30-i)*3600000;hour[i][6]=hour[i][0]+3599999;}
  hour.at(-1)[5]='50';
  const five=Array.from({length:30},(_,i)=>candle(cutoff-(30-i)*300000,300000));
  const end=Date.UTC(2026,9,10,4);
  const oi=Array.from({length:26},(_,i)=>({symbol,timestamp:end-(25-i)*3600000,sumOpenInterest:String(100+i*2),sumOpenInterestValue:String(10000+i*1000)}));
  const ticker={symbol,lastPrice:'110',openPrice:'100',highPrice:'120',lowPrice:'90',priceChangePercent:'10',quoteVolume:'100000000',openTime:cutoff-86400000,closeTime:cutoff-1000};
  const wrap=(endpoint,raw,params={symbol,endTime:cutoff})=>({endpoint,params,raw});
  const sources={ticker:wrap('/fapi/v1/ticker/24hr',ticker),hour:wrap('/fapi/v1/klines',hour,{symbol,interval:'1h',endTime:cutoff}),five:wrap('/fapi/v1/klines',five,{symbol,interval:'5m',endTime:cutoff}),oi:wrap('/futures/data/openInterestHist',oi,{symbol,period:'1h',endTime:cutoff}),funding:wrap('/fapi/v1/fundingRate',[
    {symbol,fundingTime:cutoff-36000000,fundingRate:'0.001'},
    {symbol,fundingTime:cutoff-7200000,fundingRate:'-0.002'}]),premium:wrap('/fapi/v1/premiumIndex',{symbol,lastFundingRate:'-0.002',time:cutoff-1000}),accounts:wrap('/futures/data/globalLongShortAccountRatio',[{symbol,longAccount:'0.28',shortAccount:'0.72',timestamp:cutoff-1800000}]),fundingInfo:wrap('/fapi/v1/fundingInfo',[])};
  return {runId:'TEST_FIXTURE',symbol,identity,ticker,sources,cutoff};
}
