import cron from 'node-cron';
import {setTimeout as pause} from 'node:timers/promises';
import {pathToFileURL} from 'node:url';
import {config,times,safeError} from './config.js';
import {runResearch,saveSkippedRun} from './main.js';
import {flushDeliveryQueue} from './storage/delivery-queue.js';
import {terminalLogger} from './logging.js';
export const SCHEDULE='0 9-23 * * *',TIMEZONE='Asia/Shanghai',CLOSE_DELAY_MS=10000;
export function isScheduledAt(ms){
  if(!Number.isSafeInteger(ms)||ms%3600000!==0)return false;
  const hour=Number(times(ms).shanghai.slice(11,13));return hour>=9 && hour<=23;
}
export function hourlyRunId(ms){
  if(!isScheduledAt(ms))throw new Error('INVALID_SCHEDULED_AT');
  const local=times(ms).shanghai;return `hourly_${local.slice(0,10).replaceAll('-','')}_${local.slice(11,13)}00`;
}
export function nextScheduledAt(ms){
  let next=Math.floor(ms/3600000)*3600000+3600000;
  while(!isScheduledAt(next))next+=3600000;return next;
}
export function createScanner({scheduler=cron,research=runResearch,deliveryWorker=flushDeliveryQueue,scheduleQueuePoll=setInterval,cancelQueuePoll=clearInterval,recordSkipped=saveSkippedRun,now=Date.now,sleep=pause,signals=process,log=terminalLogger({now}),write=line=>console.log(line)}={}){
  let startedAt=null,task=null,active=null,stopping=false,stopPromise=null,queueTimer=null,queueActive=null,queueController=null;
  const seen=new Set(),controller=new AbortController();
  const next=()=>log('Next run',{time:times(nextScheduledAt(now())).shanghai.slice(0,19).replace('T',' ')});
  async function record(ms,status){
    if(!isScheduledAt(ms) || ms<=startedAt)return;
    try{await recordSkipped({runId:hourlyRunId(ms),scheduledAt:ms,status,now});}catch(e){log('Schedule state failed',{error:safeError(e)});}
    log(status,{runId:hourlyRunId(ms)});
  }
  async function trigger(context){
    const scheduledAt=context?.date instanceof Date?context.date.getTime():NaN;
    if(stopping || startedAt===null || !isScheduledAt(scheduledAt) || scheduledAt<=startedAt || now()<scheduledAt)return;
    const id=hourlyRunId(scheduledAt);
    if(seen.has(id))return;seen.add(id);
    // If the event loop was suspended, record missed slots but never catch up.
    if(now()-scheduledAt>=60000){await record(scheduledAt,'SKIPPED_MISSED');next();return;}
    if(active){await record(scheduledAt,'SKIPPED_OVERLAP');return;}
    log('Scheduled run',{runId:id});
    active=(async()=>{
      try{
        if(queueActive){queueController?.abort(new Error('RESEARCH_TAKES_PRIORITY'));await queueActive;}
        await sleep(Math.max(0,scheduledAt+CLOSE_DELAY_MS-now()),undefined,{signal:controller.signal});
        controller.signal.throwIfAborted();
        if(now()-scheduledAt>=60000){await record(scheduledAt,'SKIPPED_MISSED');return;}
        await research({mode:'once',runId:id,scheduledAt,triggerType:'HOURLY',scannerStartedAt:startedAt,sendEnabled:true,handleSignals:false,setExitCode:false,signal:controller.signal},{log,now});
      }catch(e){
        if(controller.signal.aborted)await record(scheduledAt,'INTERRUPTED');
        else {log('Run failed',{runId:id,error:safeError(e)});await record(scheduledAt,'FAILED');}
      }finally{if(!stopping){log('Status: WAITING');next();}}
    })();
    try{await active;}finally{active=null;}
  }
  const onSignal=()=>{void stop().catch(e=>{log('Shutdown failed',{error:safeError(e)});process.exitCode=1;});};
  async function start(){
    if(startedAt!==null)return;startedAt=now();
    task=scheduler.createTask(SCHEDULE,trigger,{timezone:TIMEZONE,noOverlap:false,
      logger:{info:()=>{},warn:()=>log('Scheduler warning'),error:()=>log('Scheduler error'),debug:()=>{}}});
    task.on?.('execution:missed',ctx=>{void record(ctx.date.getTime(),'SKIPPED_MISSED');});
    signals.on('SIGINT',onSignal);signals.on('SIGTERM',onSignal);
    write('BA-BIAS Shadow Scanner\nMode: HOURLY\nTimezone: Asia/Shanghai\nSchedule: 0 9-23 * * *\nDingTalk: ENABLED\nStatus: WAITING');next();
    try{await task.start();}catch(e){await stop();throw e;}
    if(deliveryWorker){queueTimer=scheduleQueuePoll(()=>{
      if(stopping || active || queueActive)return;
      queueController=new AbortController();
      const signal=AbortSignal.any([controller.signal,queueController.signal]);
      queueActive=Promise.resolve().then(()=>deliveryWorker({signal,now,log})).catch(e=>log('Delivery worker failed',{error:safeError(e)})).finally(()=>{queueActive=null;});
    },5000);queueTimer.unref?.();}
  }
  async function stop(){
    if(stopPromise)return stopPromise;
    stopping=true;cancelQueuePoll(queueTimer);controller.abort(new Error('SCANNER_STOPPING'));
    stopPromise=(async()=>{
      log('Status: STOPPING');
      try{await task?.stop();await active;await queueActive;}finally{
        await task?.destroy();signals.removeListener('SIGINT',onSignal);signals.removeListener('SIGTERM',onSignal);log('Status: STOPPED');
      }
    })();return stopPromise;
  }
  return {start,stop,trigger,get state(){return {startedAt,stopping,running:Boolean(active)};}};
}
export async function startScanner(){
  if(!config.deepseekKey || !config.webhook)throw new Error('MISSING_SCANNER_ENVIRONMENT');
  const scanner=createScanner();await scanner.start();return scanner;
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  startScanner().catch(e=>{console.error(safeError(e));process.exitCode=1;});
}
