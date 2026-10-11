import fs from 'node:fs';
if (fs.existsSync('.env')) process.loadEnvFile('.env');
const integer = (name, fallback, min = 1, max = 10000000) => {
  const n = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`INVALID_CONFIG:${name}`);
  return n;
};
export const config = {
  proxy: process.env.ICT_PROXY_ENABLED === '0' ? false :
    ((process.env.ICT_PROXY_ENABLED === '1' || (process.env.ICT_PROXY_HOST && process.env.ICT_PROXY_PORT)) ?
      {protocol:'http',host:process.env.ICT_PROXY_HOST || '127.0.0.1',port:integer('ICT_PROXY_PORT',7890,1,65535)} : false),
  binanceMarketDataKey:process.env.BINANCE_FUTURES_API_KEY || process.env.BINANCE_API_KEY,
  deepseekBase: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  deepseekModel: process.env.DEEPSEEK_MODEL || 'deepseek-flash',
  deepseekKey: process.env.DEEPSEEK_API_KEY,
  webhook: process.env.DINGTALK_WEBHOOK,
  maxCandidates:integer('BA_MAX_CANDIDATES',24,2,30),
  concurrency:3, timeoutMs:15000, scanTimeoutMs:integer('BA_SCAN_TIMEOUT_MS',180000,1000), runTimeoutMs:integer('BA_RUN_TIMEOUT_MS',900000,1000),
  storyThreshold:65,
  thresholds:{price24:8,price1:3,oi4:10,funding:0.1,fundingDelta:0.05,volume:2},
  // Separate, explainable initial long/short rules; existing thresholds stay intact.
  longShort:{sampleLimit:30,discoveryTimeoutMs:90000,thresholds:{shiftPp:{'1h':5,'4h':10,'24h':15},divergencePp:15,oppositeChangePp:5,materialChangePp:5}},
  dataDir:process.env.BA_DATA_DIR || 'data',
};
export const times = ms => ({ms,utc:new Date(ms).toISOString(),shanghai:new Date(ms+28800000).toISOString().replace('Z','+08:00')});
export const dayKey = ms => times(ms).shanghai.slice(0,10);
export const safeError = e => `${String(e.code || (/^[A-Z][A-Z0-9_:.-]*$/.test(e.message || '') ? e.message : 'ERROR')).replace(/[^A-Z0-9_-]/gi,'').slice(0,60)}${e.response?.status ? ':HTTP_'+e.response.status : ''}`;
