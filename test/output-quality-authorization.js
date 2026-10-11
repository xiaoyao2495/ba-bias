import fs from 'node:fs';
// This task permits only these existing production consumers to change.
export const authorizedOutputQuality=new Set(['src/analysis/structured-v4-production.js','src/analysis/directional-history.js','src/intelligence/compact-renderer.js','src/intelligence/packet.js','src/storage/history.js','src/storage/delivery-queue.js','test/cutover-authorization.js','test/v4-production.test.js','test/analyst-precision.test.js','test/output-quality.test.js','test/output-quality-authorization.js','src/intelligence/v4-conditions.js','src/config.js','src/main.js','test/core.test.js','test/directional.test.js','test/hourly.test.js','test/long-short.test.js','test/no-edge-render-forensic.test.js','test/analyst-v3-live-preflight.test.js']);
const captured=JSON.parse(fs.readFileSync(new URL('../validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/before-hashes.json',import.meta.url)));
// Real authorized production runs occurred after historical task manifests.
// Check current frozen production data instead of incorrectly reverting that history.
export const protectedHash=(file,historical)=>(file.startsWith('data/')||file==='.env')?captured[file]??historical:historical;
