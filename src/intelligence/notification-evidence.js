const eventIdentity=f=>f?`${f.timestamp}:${f.from}:${f.to}`:null;
export function flipRole(flip,oldFlip,previousObservedAt){
  if(!flip)return 'NO_FLIP_EVENT';
  if(eventIdentity(flip)===eventIdentity(oldFlip))return flip.status===oldFlip.status?'PREVIOUSLY_KNOWN_FLIP_CONTEXT':'FLIP_STATE_UPDATE';
  if(Number.isSafeInteger(previousObservedAt)&&Number.isSafeInteger(flip.timestamp)&&flip.timestamp<=previousObservedAt)return 'PREVIOUSLY_KNOWN_FLIP_CONTEXT';
  // First recorded detection is distinct from the exchange event's formation time.
  return 'NEW_FLIP_EVENT';
}
export function comparisonBaseline(previous,currentObservedAt){
  const observed=previous?.lastResearchTime;
  return {comparisonSnapshotId:previous?.storyKey??null,previousRunId:previous?.runId??null,previousObservedAt:Number.isSafeInteger(observed)?observed:null,currentObservedAt,previousOutputAt:Number.isSafeInteger(previous?.lastOutputTime)?previous.lastOutputTime:null,basis:'LAST_SAVED_STORY_SNAPSHOT'};
}
