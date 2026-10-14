import {pathToFileURL as retiredAuditEntryURL} from 'node:url';
// Immutable old reports are retained; this legacy replay CLI cannot run after hard cutover.
if(process.argv[1]&&import.meta.url===retiredAuditEntryURL(process.argv[1]).href)throw Error('LEGACY_REPLAY_RETIRED_USE_V2_OFFLINE_TESTS');
// Offline formatting replay only. No client, scanner, LLM or delivery is invoked.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {mockCompact,wifRecord} from '../test/compact-fixture.js';
import {compactIntelligenceText,directionalDisplayState} from '../src/intelligence/compact-renderer.js';
import {intelligenceText} from '../src/intelligence/packet.js';
import {splitMessage} from '../src/storage/delivery-queue.js';
import {deliveryId} from '../src/storage/delivery.js';
const chars=s=>[...s].length,hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const wifPath='data/outbox/hourly_20261010_2100_WIFUSDT.json',before=hash(await fs.readFile(wifPath));
const records=[['真实 WIF：已保存运行记录，只读回放',wifRecord()],['Mock：有效 BULLISH',mockCompact()],['Mock：MATERIAL_UPDATE，有效 BEARISH',mockCompact({material:true,sign:-1})]];
const examples=records.map(([label,r],i)=>{
  const id=deliveryId(r),text=compactIntelligenceText(r.intelligence,r);
  // Actual WIF baseline is its persisted four payloads, not a regenerated old template.
  const oldParts=i===0?r.delivery.parts.map(p=>p.content):splitMessage(intelligenceText(r.intelligence,r),{id,symbol:r.symbol});
  const old=oldParts.map(p=>{if(!p.startsWith('检测 · BA-BIAS / '+r.symbol+'\nDeliveryId：'))throw Error('UNKNOWN_OLD_HEADER');return p.split('\n').slice(3).join('\n');}).join('');
  const parts=splitMessage(text,{id,symbol:r.symbol}),d=r.intelligence.directional;
  const checks={symbol:text.includes(r.symbol),storySemantics:text.includes(r.intelligence.storyType),cutoff:text.includes('数据截止：'),trace:text.includes(r.runId),directionState:directionalDisplayState(d)==='ANALYST_UNAVAILABLE'?text.includes('方向研判不可用'):text.includes('方向：'),horizon:text.includes(d?.analysis?.horizon || d?.fallbackHorizon || '未确定'),invalidation:(d?.rules || []).every(rule=>text.includes(rule.description)),risk:text.includes('风险：'),triggerFacts:r.intelligence.anomalies.every(a=>a.evidenceIds.every(id=>{const e=r.intelligence.evidence.find(e=>e.evidenceId===id);return e&&(text.includes(e.phrase)||text.includes(Number(e.result).toFixed(2))||id.endsWith('.flip'));})),lossless:parts.map(p=>p.split('\n').slice(3).join('\n')).join('')===text};
  if(Object.values(checks).some(x=>!x))throw Error('P0_REPLAY_CHECK_FAILED '+label+' '+JSON.stringify(checks));
  return {label,runId:r.runId,symbol:r.symbol,oldBodyChars:chars(old),newBodyChars:chars(text),oldParts:oldParts.length,newParts:parts.length,oldPayloadChars:oldParts.reduce((n,p)=>n+chars(p),0),newPayloadChars:parts.reduce((n,p)=>n+chars(p),0),reductionPct:Number((100*(1-chars(text)/chars(old))).toFixed(2)),p0Lost:false,checks,text};
});
const walk=async dir=>(await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(async e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]))).flat();
const files=[...await walk('src'),...await walk('test'),...await walk('scripts')].filter(f=>f.endsWith('.js'));
const staticResults=files.map(file=>{const r=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(r.status!==0)throw Error(file+': '+r.stderr);return {file,passed:true};});
const protectedHashes=JSON.parse(await fs.readFile('COMPACT_PROTECTED_HASHES.json'));
for(const [file,expected] of Object.entries(protectedHashes))if(hash(await fs.readFile(file))!==expected)throw Error('PROTECTED_FILE_CHANGED '+file);
if(hash(await fs.readFile(wifPath))!==before)throw Error('HISTORIC_OUTBOX_CHANGED');
const output={mode:'OFFLINE_READ_ONLY_FORMAT_REPLAY',externalApiCalls:0,realDingTalkSends:0,scannerStarted:false,historicOutboxUnchanged:true,protectedFilesUnchanged:true,staticChecks:staticResults,examples};
await fs.writeFile('COMPACT_REPLAY.json',JSON.stringify(output,null,2)+'\n');
const tests=await fs.readFile('COMPACT_TEST_RESULTS.txt','utf8');
const testSummary=tests.split('\n').filter(s=>/ℹ (tests|pass|fail|skipped)/.test(s)).join('\n');
const table=examples.map(e=>`| ${e.label} | ${e.oldBodyChars} | ${e.newBodyChars} | ${e.oldParts} → ${e.newParts} | ${e.reductionPct}% | 否 |`).join('\n');
const fence=String.fromCharCode(96).repeat(3);
const report=`# COMPACT_INTELLIGENCE 验收报告

本次仅修改展示层。真实 WIF 的已保存四个分片只读回放为一个分片；没有运行市场扫描、调查翻转时间根因或修复 Analyst 失败。历史事件时间仅引用既有 Facts，不宣称刚刚发生。

## 文件与改动

- 新增 src/intelligence/compact-renderer.js：按实际异常选择指标；区分 VALID_NO_EDGE 与 ANALYST_UNAVAILABLE；保留全部必要复核条件及竞争证据，不截断文本。
- 修改 src/intelligence/packet.js：新增已验证竞争证据和前轮有效方向的展示元数据；只有既有比较已确认实质证据及方向变化时提供方向更新。完整文本的失败状态也改为“研判不可用”。不修改资格判断。
- 修改 src/storage/delivery-queue.js：仅替换 import 和新消息 prepareDelivery 的渲染函数。1800字节分片、安全状态、重试、投递确认及锁保持原样。
- 修改 test/hourly.test.js：保留原有测试，更新新模板断言；队列测试改用明确的旧格式多分片快照，不再假设普通消息必然超长。
- 新增 test/compact.test.js、test/compact-fixture.js：41项专项测试及 Mock 数据。
- 新增 scripts/compact-replay.js：可重复的本地格式回放和静态检查。
- 验收证据：COMPACT_PROTECTED_HASHES.json、COMPACT_TEST_RESULTS.txt、COMPACT_REPLAY.json。

## 本地完整研究与出口

FULL_INTELLIGENCE 复用 data/runs/<RunId>/facts/<Symbol>.json（原始响应、全量证据、窗口与来源），stories/<Symbol>.judge.json（Judge完整结果），directional/<Symbol>.json（Analyst原始结果、校验和错误），intelligence/<Symbol>.json（完整Packet及WHAT_CHANGED）；data/directional/<snapshotId>.json 和 data/directional-results/ 保存独立研判与后续评价。data/outbox/<RunId>_<Symbol>.json 保留完整Packet、历史变化依据、Facts路径、投递ID与全部消息状态；data/state/history.json 保存历史摘要。没有复制大型原始响应。

真实示例的入口：data/outbox/hourly_20261010_2100_WIFUSDT.json；对应 data/runs/hourly_20261010_2100/{facts,stories,directional,intelligence}/ 的 WIFUSDT 文件均可追溯。原Outbox SHA256：${before}（回放前后相同）。

当前 INTELLIGENCE_FIRST 主出口是 main.js → prepareDelivery → 持久化Outbox → drainDeliveryQueue → sendText。历史文章出口 storage/delivery.js → clients/dingtalk.js 的 notification/sendNotification 保持原样；两者不共用精简渲染函数。intelligenceText 继续提供完整本地展示；不作为新情报队列正文。

## 展示规则

标题明确首次情报与重要变化。保留已收盘价格1h/4h/24h和OI数量对应窗口；滚动24h单独标明，不替换已收盘数据。其他指标依异常选择：账户分布/精确百分点变化/历史翻转，顶部账户或持仓份额，账户对账户背离，成交量比较窗口，已结算Funding及相邻结算时间。5m异常不可被1h数据替代。未知指标明确缺失，不改变输出资格。

方向优先显示已验证的五类结论、周期与定性强度，随后显示已验证核心判断、交易观察、全部失效/复核规则、竞争证据、替代情景和必要风险。有效NO_EDGE显示“暂无明确方向优势”；失败、无结果或不可判断显示“方向研判不可用，需人工复核”，不提供有效方向结论。失败的fallback周期只标作复核尺度，不当预测。

关键事件时间、数据截止与RunId保留；当小时价格/OI采样早于截止时额外标注其观测时间。全量Evidence IDs、接口路径、重复时间、WHAT_CHANGED JSON、完整Funding历史与内部状态只保留本地。身份仅使用已核实名称；未核实名称不猜测。普通目标350—700字符，重要内容超过目标仍全部保留。

MATERIAL_UPDATE只展示有前轮RunId、前后有限数值且当前值匹配已验证指标的同口径变化。两轮方向均有效、相同周期且既有比较确认实质新证据及方向变化时，展示方向更新；措辞变化不会触发研究或投递。

## 分片与安全

现有逐Unicode字符UTF-8字节分片原样保留，顺序及重建无损。新格式仅用于新生成消息；重启读取已有part.content，不重新渲染PENDING内容。SENT不重发，UNKNOWN不盲目重试，SENDING恢复语义、HTTP/业务码确认、限流冷却、有限重试、持久化锁和待发送队列保持。关键词“检测”每个分片保留。无消息配额；7条通过Mock队列全部投递，原有超过30条与去重/MATERIAL_UPDATE测试继续通过。

## 测试与边界

原199项保留，新增41项，全部240/240通过，无跳过。检测、Facts、Judge阈值、Analyst Prompt/Schema/Guard、History MATERIAL_UPDATE/去重、HTTP/Binance/DeepSeek、调度、价格/OI/Funding/账户阈值及.env的受保护文件hash均不变。源/测试/回放共${staticResults.length}个JavaScript文件的node --check全部通过。测试使用Mock；真实WIF文件仅用于只读格式验收，没有外部请求。

${fence}text
${testSummary}
${fence}

未调用外部API，未发送真实钉钉，未启动常驻进程。保留 npm run scan 前台常驻方式，不新增PM2；未修改旧项目和AI Pro Cron。

## 三条回放消息与统计

字符数按Unicode码点统计，包含中文、ASCII与换行，正文不含固定DeliveryId/分片包头；分片数按现有1800字节规则。真实WIF旧正文来自实际持久化4个payload，Mock旧正文由原完整模板生成。COMPACT_REPLAY.json另存含包头字符数、检查明细及文本。P0检查通过且未丢失关键事实、方向可用状态、周期、失效规则、必要风险及关键时间。

| 示例 | 旧正文字符数 | 新正文字符数 | 分片数 | 精简比例 | P0丢失 |
| --- | ---: | ---: | --- | ---: | --- |
${table}

${examples.map(e=>`### ${e.label}\n\n${fence}text\n${e.text}\n${fence}\n`).join('\n')}
`;
await fs.writeFile('COMPACT_INTELLIGENCE_VALIDATION.md',report);
console.log(JSON.stringify({tests:testSummary,staticFiles:staticResults.length,examples:examples.map(({label,oldBodyChars,newBodyChars,oldParts,newParts,reductionPct,p0Lost})=>({label,oldBodyChars,newBodyChars,oldParts,newParts,reductionPct,p0Lost}))},null,2));
