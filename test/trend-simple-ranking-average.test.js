import test from 'node:test';
import assert from 'node:assert/strict';
import {aggregateRankingSnapshots} from '../src/web/trend-simple-ranking-aggregate.js';

const snapshot=(cycle,candidates)=>({schemaVersion:'BULL_CANDIDATE_RANKING_V1',evaluationTime:cycle,candidates:candidates.map((x,index)=>({symbol:x.symbol,rank:index+1,originalRank:index+1,candidateCategory:x.category||'STRUCTURE_BULLISH',adx14:x.adx??20,er20:x.er??.2,selectedForLLM:x.selected===true,excludedFromLLM:x.excluded===true,exclusionReason:x.reason??null,cooldownUntil:x.cooldownUntil??null}))});

test('24-round average rewards persistent candidates over a one-round first place',()=>{
 const rounds=Array.from({length:24},(_,i)=>snapshot(600-i*5,[...(i===0?[{symbol:'BURSTUSDT',adx:50}]:[]),{symbol:'STEADYUSDT',adx:25}]));
 const result=aggregateRankingSnapshots(rounds),steady=result.items.find(x=>x.symbol==='STEADYUSDT'),burst=result.items.find(x=>x.symbol==='BURSTUSDT');
 assert.equal(result.roundsUsed,24);assert.equal(result.items[0].symbol,'STEADYUSDT');assert.equal(steady.appearances,24);assert.equal(steady.appearanceRate,1);assert.ok(steady.averageScore>burst.averageScore);assert.equal(burst.appearances,1);
});

test('missing rounds count as zero and latest saved research state is preserved',()=>{
 const rounds=[snapshot(100,[{symbol:'BTCUSDT',selected:true,category:'BOTH_BULLISH',adx:30,er:.4}]),snapshot(95,[]),snapshot(90,[{symbol:'BTCUSDT',excluded:true,reason:'BULL_COOLDOWN',cooldownUntil:1000,adx:20,er:.2}])];
 const result=aggregateRankingSnapshots(rounds,24),row=result.items[0];
 assert.equal(result.roundsUsed,3);assert.equal(row.averageScore,200/3);assert.equal(row.appearances,2);assert.equal(row.selectedCount,1);assert.equal(row.averageAdx14,25);assert.equal(row.latest.selectedForLLM,true);assert.equal(row.latest.category,'BOTH_BULLISH');
});

test('window selects exactly 24 or 48 newest valid snapshots with 24 as default',()=>{
 const rounds=Array.from({length:60},(_,i)=>snapshot(120-i,[{symbol:`S${i}USDT`}]))
 assert.equal(aggregateRankingSnapshots(rounds).roundsUsed,24);
 assert.equal(aggregateRankingSnapshots(rounds,24).roundsUsed,24);assert.equal(aggregateRankingSnapshots(rounds,24).items.length,24);
 assert.equal(aggregateRankingSnapshots(rounds,48).roundsUsed,48);assert.equal(aggregateRankingSnapshots(rounds,48).items.length,48);
});
