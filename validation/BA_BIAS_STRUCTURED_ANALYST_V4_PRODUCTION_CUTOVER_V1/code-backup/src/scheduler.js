// Compatibility entry: the same foreground scanner, with automatic reviewed notices.
import {startScanner} from './scan-daemon.js';
import {safeError} from './config.js';
startScanner().catch(e=>{console.error(safeError(e));process.exitCode=1;});
