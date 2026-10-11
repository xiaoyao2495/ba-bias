import {authorizedOutputQuality} from './output-quality-authorization.js';
// Explicit scope authorized by BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1.
// Historical hash assertions still protect every other file; per-cutover tests
// verify unchanged data/env/market/Judge/queue and the exact modified-file list.
export const authorizedCutover=new Set([...authorizedOutputQuality,
 'src/main.js','src/intelligence/packet.js','src/intelligence/compact-renderer.js','src/analysis/directional-history.js',
 'src/analysis/experimental/structured-v4-schema.js','src/analysis/experimental/structured-v4-input.js','src/analysis/experimental/structured-v4-guard.js','src/analysis/experimental/structured-v4-renderer.js','src/analysis/experimental/structured-v4-provenance.js',
 'test/directional-fixture.js','test/hourly.test.js','test/long-short.test.js',
 'test/analyst-alignment.test.js','test/analyst-generation.test.js','test/compact.test.js','test/structured-v4-live-preflight.test.js','test/structured-v4.test.js','test/validation-recovery.test.js'
]);
