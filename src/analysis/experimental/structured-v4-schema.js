import Ajv from 'ajv';
export const EXPERIMENT='STRUCTURED_ANALYST_V4_EXPERIMENT';
const ids={type:'array',uniqueItems:true,items:{type:'string',minLength:1}};
const object=properties=>({type:'object',additionalProperties:false,required:Object.keys(properties),properties});
export const outputSchema=object({
 version:{const:EXPERIMENT},status:{const:'NOT_PRODUCTION'},provenance:{const:'SYNTHETIC_OR_CONVERTED'},causalBacktestEligible:{const:false},
 symbol:{type:'string'},evaluationTime:{type:'string'},direction:{enum:['BULLISH','BEARISH','BULLISH_REVERSAL','BEARISH_REVERSAL','NO_EDGE']},horizon:{enum:['1h','4h','24h']},conviction:{enum:['LOW','MODERATE','HIGH']},
 supportingEvidenceIds:{...ids,minItems:1},conflictingEvidenceIds:ids,structureEvidenceIds:ids,
 mechanismHypothesis:object({type:{enum:['CO_MOVEMENT_ONLY','CONTRACT_EXPANSION_COMPATIBLE','CONTRACT_CONTRACTION_COMPATIBLE','UNDETERMINED']},evidenceIds:ids,limitation:{const:'PARTICIPANT_BEHAVIOR_UNCONFIRMED'}}),
 directionalRationale:object({hypothesis:{enum:['CONTINUATION','TURN','COUNTER_MOVE','NO_CLEAR_EDGE']},evidenceIds:{...ids,minItems:1},alternative:{enum:['OPPOSITE_MOVE','CONSOLIDATION','CONTINUATION']},certainty:{const:'CONDITIONAL_NOT_CONFIRMED'}}),
 tradeOpportunity:{enum:['WAIT_FOR_CONFIRMATION','WAIT_FOR_PULLBACK','NO_ACTIONABLE_SETUP','LONG_SETUP','SHORT_SETUP']},
 reassessmentConditions:{type:'array',minItems:1,items:{oneOf:[
 object({conditionType:{const:'PROGRAM_RULE'},ruleId:{type:'string'}}),
 object({conditionType:{const:'ABSTRACT_REASSESSMENT'},metricOrStructureEvidenceId:{type:'string'},interpretation:{const:'MONITOR_CHANGE'},consequence:{const:'REASSESS_ONLY'}}),
 object({conditionType:{const:'STRUCTURE_BOUNDARY'},metricOrStructureEvidenceId:{type:'string'},operator:{enum:['LTE','GTE']},consequence:{enum:['REASSESS_ONLY','INVALIDATED']}}),
 object({conditionType:{const:'INSUFFICIENT_STRUCTURE_DATA'},consequence:{const:'NO_MECHANICAL_INVALIDATION'}})
 ]}}
});
export const validateOutput=new Ajv({allErrors:true,strict:true}).compile(outputSchema);
// Legacy outputSchema is deliberately retained, including synthetic provenance.
// New model business JSON omits provenance; the runner owns the envelope.
export const modelOutputSchema=structuredClone(outputSchema);
delete modelOutputSchema.properties.provenance;
modelOutputSchema.required=modelOutputSchema.required.filter(k=>k!=='provenance');
export const validateModelOutput=new Ajv({allErrors:true,strict:true}).compile(modelOutputSchema);
const nullableString={type:['string','null']};
export const envelopeSchema=object({
 version:{const:'V4_PROVENANCE_ENVELOPE_V1'},
 provenance:object({sourceType:{enum:['SYNTHETIC_OR_CONVERTED','LIVE_MODEL_RESPONSE']},executionKind:{enum:['MOCK','LIVE_API','OFFLINE_LEGACY']},provider:nullableString,model:nullableString,requestedModel:nullableString,requestId:nullableString,requestIdKind:{enum:['LOCAL_TRACKING_ID','NOT_AVAILABLE']},serverResponseId:nullableString,requestedAt:nullableString,receivedAt:nullableString,requestHash:nullableString,responseHash:nullableString,inputHash:nullableString}),
 analysis:{},audit:object({legacySyntheticFieldRemoved:{type:'boolean'},businessSourceConflict:{type:'boolean'},parseError:nullableString})
});
export const validateEnvelope=new Ajv({allErrors:true,strict:true}).compile(envelopeSchema);

// Production promotion changes metadata only; all business constraints are identical.
export const productionOutputSchema=structuredClone(modelOutputSchema);
productionOutputSchema.properties.version={const:'STRUCTURED_ANALYST_V4'};
productionOutputSchema.properties.status={const:'PRODUCTION'};
export const validateProductionOutput=new Ajv({allErrors:true,strict:true}).compile(productionOutputSchema);
