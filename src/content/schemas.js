import Ajv from 'ajv';
const ajv=new Ajv({allErrors:true});
const strings={type:'array',items:{type:'string'},maxItems:12};
const type={enum:['NEW_STORY','MATERIAL_UPDATE']};
export const judgeSchema={type:'object',additionalProperties:false,required:['eligible','storyType','newsworthinessScore','reason','keyEvidenceIds','risks','storyAngle'],properties:{eligible:{type:'boolean'},storyType:type,newsworthinessScore:{type:'number',minimum:0,maximum:100},reason:{type:'string',minLength:1,maxLength:1000},keyEvidenceIds:{...strings,minItems:0,uniqueItems:true},risks:strings,storyAngle:{type:'string',minLength:1,maxLength:1000}}};
export const draftSchema={type:'object',additionalProperties:false,required:['symbol','storyType','title','body','observation','evidenceIds'],properties:{symbol:{type:'string'},storyType:type,title:{type:'string',minLength:1,maxLength:160},body:{type:'string',minLength:1,maxLength:1200},observation:{type:'string',minLength:1,maxLength:500},evidenceIds:{...strings,minItems:2,maxItems:4,uniqueItems:true}}};
export const validateJudge=ajv.compile(judgeSchema),validateDraft=ajv.compile(draftSchema);
