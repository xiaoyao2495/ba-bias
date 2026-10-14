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

// BA_BIAS_MARKET_BIAS_V2_HARD_CUTOVER_IMPLEMENTATION_V1: explicit consumer-only scope.
// New behavior is independently asserted in V2 contract/e2e/production and Web security suites.
for(const file of ['src/analysis/active-analyst.js','src/analysis/active-analyst.json','src/scan-daemon.js','src/web/reader.js','src/web/public-dto.js','src/web/server.js','web/assets/app.js','web/assets/presentation.js','scripts/analyst-version.js','scripts/analyst-live-probe.js','scripts/structured-v4-live-preflight.js','scripts/structured-v4-live-rerun.js','test/compact-fixture.js','test/analyst-precision.test.js','test/analyst-alignment.test.js','test/analyst-generation.test.js','test/validation-recovery.test.js','test/cutover-authorization.js','test/public-web.test.js','test/web-dashboard.test.js','test/dashboard-simplification.test.js','test/pm2-entry-fixture.js','test/web-pm2-fixture.js'])authorizedCutover.add(file);

for(const file of ['scripts/compact-replay.js', 'scripts/v4-output-quality-replay.js', 'scripts/v4-failure-render-replay.js', 'scripts/validation-recovery-replay.js', 'scripts/dashboard-replay.js', 'scripts/structured-v4-provenance-replay.js', 'scripts/structured-v4-provenance-offline.js'])authorizedCutover.add(file);

authorizedCutover.add('README.md');
