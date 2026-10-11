import {config} from '../config.js';
export function detectLongShort(ls,thresholds=config.longShort.thresholds){
  if(!ls)return [];
  const anomalies=[];
  for(const [key,kind] of [['global','ACCOUNT_DISTRIBUTION_SHIFT'],['topAccounts','TOP_ACCOUNT_DISTRIBUTION_SHIFT'],['topPositions','TOP_POSITION_DISTRIBUTION_SHIFT']]){
    const s=ls[key];if(!s?.quality.available)continue;
    const qualifying=Object.entries(s.windows).filter(([window,w])=>w.shortChangePp!==null&&Math.abs(Number(w.shortChangePp))>=thresholds.shiftPp[window]);
    if(qualifying.length){const [window,w]=qualifying.sort((a,b)=>Math.abs(Number(b[1].shortChangePp))/thresholds.shiftPp[b[0]]-Math.abs(Number(a[1].shortChangePp))/thresholds.shiftPp[a[0]])[0];anomalies.push({kind,scope:s.scope,window,value:w.shortChangePp,unit:'percentage_points',threshold:thresholds.shiftPp[window],strength:Math.min(5,Math.abs(Number(w.shortChangePp))/thresholds.shiftPp[window]),evidenceIds:qualifying.flatMap(([,x])=>x.evidenceIds)});}
    if(key==='global'&&s.dominanceFlip&&s.flip.evidenceId)anomalies.push({kind:'ACCOUNT_DOMINANCE_FLIP',value:s.flip.status,scope:s.scope,strength:s.flip.status==='CONFIRMED'?2:1,threshold:'strict crossing of 50%; 2 consecutive samples confirm',evidenceIds:[s.flip.evidenceId]});
  }
  const d=ls.divergence;
  if(d?.evidenceId){const opposite=!d.changeReason&&Number(d.globalLongChange4hPp)*Number(d.topLongChange4hPp)<0&&Math.min(Math.abs(Number(d.globalLongChange4hPp)),Math.abs(Number(d.topLongChange4hPp)))>=thresholds.oppositeChangePp;
    if(Math.abs(Number(d.gapPp))>=thresholds.divergencePp||opposite)anomalies.push({kind:'TOP_GLOBAL_DIVERGENCE',scope:d.scope,value:d.gapPp,unit:'percentage_points',oppositeChangeDirections:opposite,threshold:thresholds.divergencePp,strength:Math.max(1,Math.min(5,Math.abs(Number(d.gapPp))/thresholds.divergencePp)),evidenceIds:[d.evidenceId]});
  }
  return anomalies;
}
