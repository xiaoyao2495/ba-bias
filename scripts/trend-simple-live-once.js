import path from 'node:path';
import {promises as fs} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {config,safeError} from '../src/config.js';
import {Binance} from '../src/clients/binance.js';
import {DeepSeek} from '../src/clients/deepseek.js';
import {Http} from '../src/clients/http.js';
import {lock} from '../src/storage/history.js';
import {runSimpleRound,roundId,SLOT} from '../src/trend-simple/engine.js';

export const latestCycle=now=>Math.floor((now-10000)/SLOT)*SLOT;

// A single run uses a separate data root and never starts a scheduler.
export async function runLiveOnce({settings=config,now=Date.now,acquire=lock,run=runSimpleRound,client,call}={}){
  if(!settings.deepseekKey)throw new Error('MISSING_DEEPSEEK_API_KEY');
  const endpoint=new URL(settings.deepseekBase);
  if(endpoint.protocol!=='https:'||endpoint.hostname!=='api.deepseek.com'||endpoint.pathname!=='/'||endpoint.search||endpoint.hash||endpoint.username||endpoint.password)throw new Error('UNTRUSTED_DEEPSEEK_ENDPOINT');
  const controller=new AbortController(),liveRoot=path.resolve(settings.dataDir,'trend-simple-live-check');
  const release=await acquire(liveRoot,{onCompromised:()=>controller.abort()});
  try{
    const dataDir=path.join(liveRoot,'attempts',randomUUID());
    const market=client||new Binance(new Http({concurrency:5,retries:2,signal:controller.signal}));
    const judge=call|| (async(system,input,signal)=>{
      const http=new Http({concurrency:1,spacing:0,retries:0,signal});
      const llm=new DeepSeek(http),value=await llm.json(system,input,{maxTokens:2400});
      if(llm.calls[0]?.raw?.choices?.[0]?.finish_reason!=='stop')throw new Error('LLM_INCOMPLETE');
      return value;
    });
    const cycle=latestCycle(now()),diagnosticsDir=path.join(dataDir,'trend-simple-v1','runs',roundId(cycle),'llm-diagnostics');
    const loggedJudge=async(system,input,signal)=>{
      const symbol=input?.symbol;
      if(typeof symbol!=='string'||!/^[A-Z0-9]{1,40}$/.test(symbol))throw Error('INVALID_DIAGNOSTIC_SYMBOL');
      let response;
      try{response=await judge(system,input,signal);}catch(error){
        await fs.mkdir(diagnosticsDir,{recursive:true});
        await fs.writeFile(path.join(diagnosticsDir,`${symbol}.json`),JSON.stringify({symbol,error:safeError(error)},null,2)+'\n',{mode:0o600,flag:'wx'});
        throw error;
      }
      await fs.mkdir(diagnosticsDir,{recursive:true});
      await fs.writeFile(path.join(diagnosticsDir,`${symbol}.json`),JSON.stringify({symbol,response},null,2)+'\n',{mode:0o600,flag:'wx'});
      return response;
    };
    const result=await run({cycle,dataDir,client:market,call:loggedJudge,signal:controller.signal});
    return {runId:result.runId,status:result.status,duplicate:result.duplicate??false,calls:result.calls??null,coverage:result.coverage??null,results:(result.results??[]).map(({symbol,status,bias,error,validationIssues})=>({symbol,status,bias,error,validationIssues})),dataDir,diagnosticsDir};
  }finally{await release();}
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  runLiveOnce().then(result=>{console.log(JSON.stringify(result,null,2));if(result.status!=='COMPLETE'||result.duplicate)process.exitCode=1;}).catch(error=>{console.error(safeError(error));process.exitCode=1;});
}
