import {INTERVAL} from './config.js';
// Replayed in time order. A pivot becomes visible only after the second right bar closes.
export function structureAt(bars){const raw=[],swings=[],events=[],broken=new Set();
 for(let i=0;i<bars.length;i++){
  if(i>=4){const j=i-2,b=bars[j],other=[bars[j-2],bars[j-1],bars[j+1],bars[j+2]],high=other.every(x=>b.high>x.high),low=other.every(x=>b.low<x.low);
   if(high||low){const type=high&&low?'AMBIGUOUS_DUAL_PIVOT':high?'HIGH':'LOW',p={id:`${type}_${b.openTime}`,type,price:type==='HIGH'?b.high:type==='LOW'?b.low:null,pivotOpenTime:b.openTime,confirmedAt:bars[i].openTime+INTERVAL,method:'FRACTAL_2_2'};raw.push(p);
    if(type!=='AMBIGUOUS_DUAL_PIVOT'){const last=swings.at(-1);if(!last||last.type!==type){if(last)last.lockStatus='LOCKED';swings.push({...p,lockStatus:'ACTIVE_LEG'});}else if(type==='HIGH'?p.price>last.price:p.price<last.price)swings[swings.length-1]={...p,lockStatus:'ACTIVE_LEG'};
     let previous={};for(const s of swings){const old=previous[s.type];s.classification=!old?null:s.type==='HIGH'?s.price>old.price?'HH':s.price<old.price?'LH':'EH':s.price>old.price?'HL':s.price<old.price?'LL':'EL';previous[s.type]=s;}
    }
   }
  }
  for(const [classification,eventType,breaks] of [['HL','BULLISH_STRUCTURE_DAMAGED',(a,b)=>a<b],['LH','BEARISH_STRUCTURE_DAMAGED',(a,b)=>a>b]]){const ref=swings.filter(s=>s.lockStatus==='LOCKED'&&s.classification===classification).at(-1);if(ref&&!broken.has(ref.id)&&breaks(bars[i].close,ref.price)){broken.add(ref.id);events.push({eventType,referencePivotId:ref.id,referencePrice:ref.price,breakClose:bars[i].close,eventTime:bars[i].openTime+INTERVAL});}}
 }
 const high=swings.filter(s=>s.lockStatus==='LOCKED'&&s.type==='HIGH').at(-1),low=swings.filter(s=>s.lockStatus==='LOCKED'&&s.type==='LOW').at(-1),latest=swings.at(-1),end=bars.at(-1)?.openTime+INTERVAL;
 const fresh=latest&&end-latest.confirmedAt<=16*INTERVAL,damaged=id=>events.some(e=>e.referencePivotId===id);
 let path='INSUFFICIENT_STRUCTURE';if(high?.classification&&low?.classification){path='MIXED_STRUCTURE';if(fresh&&high.classification==='HH'&&low.classification==='HL'&&!damaged(low.id))path='BULLISH_STRUCTURE';if(fresh&&high.classification==='LH'&&low.classification==='LL'&&!damaged(high.id))path='BEARISH_STRUCTURE';}
 return {rawPivots:raw,canonicalSwings:swings,events,path,bullishReference:low?.classification==='HL'&&!damaged(low.id)?low:null,bearishReference:high?.classification==='LH'&&!damaged(high.id)?high:null};}
