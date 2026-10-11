import {times,safeError} from './config.js';
export function terminalLogger({now=Date.now,write=line=>console.log(line)}={}){
  return (event,details={})=>{
    const time=times(now()).shanghai.slice(11,19);
    const suffix=Object.entries(details).filter(([key])=>!['webhook','secret','key','url','raw'].includes(key)).map(([key,value])=>`${key}=${typeof value==='object'?JSON.stringify(value):value}`).join(' ');
    write(`[${time}] ${event}${suffix?' '+suffix:''}`);
  };
}
export const logError=(log,event,error)=>log(event,{error:safeError(error)});
