const path = require('node:path');
const root = __dirname;
const dataDir = path.join(root, 'data-v2');
module.exports = {apps:[
 {name:'ba-bias-v2-scanner',cwd:root,script:path.join(root,'src/trend-simple-v2/pm2-entry.js'),exec_mode:'fork',instances:1,watch:false,kill_timeout:30000,shutdown_with_message:true,env:{TREND_V2_MODE:'SHADOW',TREND_V2_DATA_DIR:dataDir},out_file:path.join(root,'logs','v2-scanner-out.log'),error_file:path.join(root,'logs','v2-scanner-error.log')},
 {name:'ba-bias-v2-web',cwd:root,script:path.join(root,'src/trend-simple-v2/web-pm2-entry.js'),exec_mode:'fork',instances:1,watch:false,env:{TREND_V2_DATA_DIR:dataDir,TREND_V2_WEB_PORT:'8788'},out_file:path.join(root,'logs','v2-web-out.log'),error_file:path.join(root,'logs','v2-web-error.log')}
]};
