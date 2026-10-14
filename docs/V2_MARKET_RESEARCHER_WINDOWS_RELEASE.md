# V2 Market Researcher: controlled Windows update

This release changes research code, not financial approval. Every new result remains PENDING_MANUAL_REVIEW; there is no automatic research publication/trading. Known model limitations include OI/Funding overinterpretation, percentage/count confusion, and insufficient evidence weighing. Top trader position facts are excluded from new model input; old snapshots are retained.

Use PowerShell for the guarded sequence below (from CMD, enter `powershell -NoProfile`). Run against the actual repository. This document does not assert the Windows branch/process identity. If any verification fails, leave Scanner stopped and investigate. Never reset/clean, overwrite secrets/data, backfill runs, or invoke `npm run once`/`doctor:deepseek` for deployment.

## Inspect first

```powershell
Set-Location C:\git\ba-bias
git status --short
git branch --show-current
git rev-parse HEAD
git remote -v
node -v
npm -v
pm2 list
pm2 show ba-bias-scanner
pm2 show ba-bias-web
```

Require a clean tracked/untracked working tree, Node >=22, actual branch `main` tracking `origin/main`, remote `https://github.com/xiaoyao2495/ba-bias.git`, and exactly one Scanner/Web with the expected paths/cwd. Check all other PM2/process entries for duplicate scanners. Scanner expected entry `src/scan-pm2-entry.js`; Web expected entry `src/web/pm2-entry.js`. If these names/paths are different, do not blindly execute the following commands. Record actual names and use them only after verifying.

Record the previous commit/branch/PM2 status and effective data root without printing secrets. `BA_DATA_DIR` defaults to relative `data` (CWD is C:\git\ba-bias); process environment takes precedence over `.env` as loaded by existing config. Web retains independent `.web.env` loading and authentication mode. Do not copy Mac `.env` or modify the Windows files. Back up code identity, `.env`/`.web.env` privately and persistent data with the existing secure backup method before updating. This task never restores data to an older point during rollback.

## Fetch and safe fast-forward

Set `$target` to the exact pushed SHA in the release report/final delivery (not a branch name). Run one section at a time and stop on nonzero exit. Capture `$previous` for rollback in the same session.

```powershell
$target = Read-Host 'Paste exact ReleaseCommitSHA'
if ($target -notmatch '^[0-9a-f]{40}$') { throw 'INVALID_RELEASE_SHA' }
if (git status --porcelain) { throw 'WORKTREE_NOT_CLEAN' }
if ((git branch --show-current) -ne 'main') { throw 'UNVERIFIED_PRODUCTION_BRANCH' }
if ((git rev-parse --abbrev-ref '@{upstream}') -ne 'origin/main') { throw 'UNVERIFIED_UPSTREAM' }
if ((git remote get-url origin) -ne 'https://github.com/xiaoyao2495/ba-bias.git') { throw 'REMOTE_MISMATCH' }
$previous = git rev-parse HEAD
$previousBranch = git branch --show-current
git fetch origin
if ($LASTEXITCODE) { throw 'FETCH_FAILED' }
if ((git rev-parse origin/main) -ne $target) { throw 'REMOTE_NOT_EXPECTED_RELEASE' }
git merge-base --is-ancestor $previous $target
if ($LASTEXITCODE) { throw 'NON_FAST_FORWARD_STOP' }
# Only after inspecting the actual processes above:
pm2 stop ba-bias-scanner
if ($LASTEXITCODE) { throw 'SCANNER_STOP_FAILED' }
pm2 stop ba-bias-web
if ($LASTEXITCODE) { throw 'WEB_STOP_FAILED' }
git merge --ff-only $target
if ($LASTEXITCODE) { throw 'UPDATE_FAILED_KEEP_SERVICES_STOPPED' }
if ((git rev-parse HEAD) -ne $target) { throw 'WINDOWS_HEAD_MISMATCH' }
npm ls --omit=dev
# If dependencies are missing/invalid, use the unchanged lockfile; no lifecycle scripts:
# npm ci --ignore-scripts
```

The release does not change package.json/package-lock.json or the Node major version. No npm upgrades. Save `$previous` securely outside Git as the verified rollback identity; do not lose it when closing the shell.

## Offline identity, data readiness and Web first

```powershell
node --import ./test/offline-guard.js scripts/market-researcher-release-check.js
if ($LASTEXITCODE) { throw 'RELEASE_IDENTITY_FAILED' }
node --import ./test/offline-guard.js --test test/market-bias-v2*.test.js test/v4-production.test.js
if ($LASTEXITCODE) { throw 'V2_OFFLINE_REGRESSION_FAILED' }
node scripts/market-bias-v2-prepare.js --check
```

`--check` is read only. If it reports V2_CUTOVER_NOT_PREPARED, and only after confirming the Scanner is stopped, data backed up and the existing state identified:

```powershell
node scripts/market-bias-v2-prepare.js --plan
# Review the plan before authorizing the following one-time initialization:
# node scripts/market-bias-v2-prepare.js --apply
# node scripts/market-bias-v2-prepare.js --check
```

`--apply` creates a new V2 namespace from the legacy ledger; it is not a reset or migration of existing records. Do not run it for an already-prepared namespace. Legacy V3/V4 records remain immutable archives; legacy V2 envelopes are compatible for read only. The offline fixture Dry Run and new/old Reader checks above do not write production History or call APIs.

```powershell
node --import ./test/offline-guard.js scripts/market-researcher-release-check.js --data
if ($LASTEXITCODE) { throw 'SCANNER_ACTIVATION_BLOCKED_WITH_EVIDENCE' }
pm2 restart ba-bias-web
if ($LASTEXITCODE) { throw 'WEB_RESTART_FAILED' }
pm2 logs ba-bias-web --lines 50 --nostream
```

Confirm LISTENING and check the actual configured origin, authentication/public-readonly mode, existing pages and saved research details in the browser. Do not change listening address, firewall or auth. Known private health route: GET `/api/health`; in private mode use the existing browser login/session. Do not treat an unauthorized anonymous response as Web failure or disable auth to test. Old legacy V3/V4 archives are not rewritten into V2; unsupported archive scope can remain excluded from the V2 Dashboard.

## Scanner restoration is conditional

Keep Scanner stopped unless data readiness, Web/read-only compatibility, environment and publication checks all pass. `--data` rejects any eligible legacy V2 Outbox delivery; it does not drain/recover/rewrite messages. If rejected, report SCANNER_ACTIVATION_BLOCKED_WITH_EVIDENCE; do not edit Outbox to force approval.

Existing `startScanner()` requires DeepSeek key and the existing Webhook configuration even though new V2 research is blocked from publication. Do not print/edit either secret to bypass initialization. Existing schedule remains Asia/Shanghai `0 * * * *`, 10-second collection delay, same missed/overlap/lock behavior. Startup schedules only future runs; no extra immediate research or catch-up. WAITING proves initialization, not later hourly execution.

```powershell
# Execute only after all checks above; never cluster/watch/instances>1:
pm2 restart ba-bias-scanner
if ($LASTEXITCODE) { throw 'SCANNER_RESTART_FAILED' }
pm2 logs ba-bias-scanner --lines 80 --nostream
pm2 list
```

Verify actual loaded entry/CWD, initialized WAITING schedule, no second Scanner, and no immediate unscheduled model/delivery calls. Later normal hourly runs must be distinguished from deployment-generated extra runs. Do not trigger a real run just to smoke-test. Leave it stopped if evidence is insufficient. The banner's legacy DingTalk ENABLED text is not publication approval; actual new-format queue gating remains restrictive.

## Code-only rollback

After preserving logs, stop Scanner and Web. Verify current tree is clean and `$previous` is the recorded original commit; no reset/clean, data rewind or notification replay.

```powershell
pm2 stop ba-bias-scanner
pm2 stop ba-bias-web
if (git status --porcelain) { throw 'ROLLBACK_WORKTREE_NOT_CLEAN' }
git switch --detach $previous
if ($LASTEXITCODE) { throw 'ROLLBACK_FAILED_KEEP_STOPPED' }
if ((git rev-parse HEAD) -ne $previous) { throw 'ROLLBACK_SHA_MISMATCH' }
# Verify old-version Web configuration/data compatibility before restarting Web:
# pm2 restart ba-bias-web
```

Scanner stays stopped on rollback until its old automatic notification behavior is separately reviewed. `.env`/`.web.env` and persistent history/outbox are retained; never restore those to old snapshots. Return to `main` only after verifying a clean tree and the intended version. No automatic force push or branch rewrite.
