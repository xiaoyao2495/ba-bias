// Transport-only boundaries. All slices preserve the original UTF-16 text exactly.
const protectedToken=/\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?)?|[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?%?|[A-Za-z0-9_]+(?:[-/:.][A-Za-z0-9_]+)*|失效\/复核|交易观察|替代情景|重新评估|DeliveryId|RunId/gu;
export function splitBody(text,budget,{onBoundaryFallback=()=>{}}={}){
  const bytes=s=>Buffer.byteLength(s),chunks=[];
  const ranges=[...text.matchAll(protectedToken),...text.matchAll(/[A-Za-z0-9_]+(?:[-/:.][A-Za-z0-9_]+)*/gu)].map(m=>[m.index,m.index+m[0].length]);
  const safe=i=>!ranges.some(([a,b])=>i>a&&i<b);
  const words=new Set([...new Intl.Segmenter('zh',{granularity:'word'}).segment(text)].map(s=>s.index+s.segment.length));
  const graphemes=[...new Intl.Segmenter('zh',{granularity:'grapheme'}).segment(text)].map(s=>s.index+s.segment.length);
  let start=0;
  while(start<text.length){
    let end=start;
    for(const g of graphemes){if(g<=start)continue;if(bytes(text.slice(start,g))>budget)break;end=g;}
    if(end===start)throw new Error('MESSAGE_GRAPHEME_EXCEEDS_BUDGET');
    if(end===text.length){chunks.push(text.slice(start));break;}
    const fits=i=>i>start&&i<=end&&safe(i);
    // Entire field lines first; sentences next; then lexical boundaries.
    const candidates=(pattern)=>[...text.slice(start,end).matchAll(pattern)].map(m=>start+m.index+m[0].length).filter(fits);
    const lines=candidates(/\n/g),sentences=candidates(/[。！？；!?;](?:[”’」』])?/g);
    let boundary=lines.at(-1) ?? sentences.at(-1) ?? [...words].filter(fits).at(-1);
    if(!boundary){boundary=graphemes.filter(fits).at(-1);onBoundaryFallback({reason:boundary?'UNSEGMENTABLE_FIELD':'OVERSIZE_PROTECTED_TOKEN',offset:start,budget});}
    if(!boundary)boundary=end; // Only an indivisible token larger than the platform budget.
    chunks.push(text.slice(start,boundary));start=boundary;
  }
  return chunks.length?chunks:[''];
}
