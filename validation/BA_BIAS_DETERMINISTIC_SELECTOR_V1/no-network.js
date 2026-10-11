import http from 'node:http';import https from 'node:https';import net from 'node:net';import tls from 'node:tls';
import {syncBuiltinESMExports} from 'node:module';
const blocked=()=>{throw new Error('OFFLINE_TEST_NETWORK_FORBIDDEN');};
http.request=blocked;http.get=blocked;https.request=blocked;https.get=blocked;net.connect=blocked;net.createConnection=blocked;tls.connect=blocked;globalThis.fetch=blocked;syncBuiltinESMExports();
