import {config} from '../config.js';
import {Http} from './http.js';
export const endpoints={time:'/fapi/v1/time',exchange:'/fapi/v1/exchangeInfo',ticker:'/fapi/v1/ticker/24hr',premium:'/fapi/v1/premiumIndex',fundingInfo:'/fapi/v1/fundingInfo',klines:'/fapi/v1/klines',oi:'/futures/data/openInterestHist',funding:'/fapi/v1/fundingRate',accounts:'/futures/data/globalLongShortAccountRatio',topAccounts:'/futures/data/topLongShortAccountRatio',topPositions:'/futures/data/topLongShortPositionRatio'};
export class Binance {
  constructor(http=new Http(),{marketDataKey=config.binanceMarketDataKey}={}){this.http=http;this.marketDataKey=marketDataKey;}
  async get(endpoint,params={}) {
    if(!Object.values(endpoints).includes(endpoint))throw new Error('ENDPOINT_NOT_ALLOWED');
    const top=[endpoints.topAccounts,endpoints.topPositions].includes(endpoint);
    if(top&&!this.marketDataKey)throw Object.assign(new Error('BINANCE_MARKET_DATA_KEY_MISSING'),{code:'BINANCE_MARKET_DATA_KEY_MISSING'});
    const headers=top?{'X-MBX-APIKEY':this.marketDataKey}:undefined;
    const raw=await this.http.request({method:'GET',url:'https://fapi.binance.com'+endpoint,params,headers,proxy:config.proxy,timeout:config.timeoutMs});
    return {endpoint,params,raw,retrievedAt:Date.now()};
  }
}
