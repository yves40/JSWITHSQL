import timeHelper from '../classes/timeHelper.js'
import sqlHelper from '../classes/sqlHelper.js'
import Logger from '../classes/logger.js';
import Timer from '../classes/timer.js';

// Use the old logger
const logger = new Logger('dbtest');
const timer = new Timer();
const th = new timeHelper()
const Version = 'dbtest:1.52, Aug 29 2025';

console.log('\n\n');
timer.startTimer();
logger.setDatabaseTrace(true);
// ------------------------------------------------------------
// Class test now
// ------------------------------------------------------------
const now = th.getDateTime();  
try {
  logger.setModule('#### Section 0');
  logger.info(`INIT :  ${Version}`);
  const sqlh = new sqlHelper();
  logger.setModule('#### Section 1');
  logger.info(`PROCESS : Get 30 lines of log data with the new sqlHelper class`);
  let result = await sqlh.Select("SELECT * FROM dblog order by logtime desc limit 30");
  dumpLogs(result);
  logger.setModule('#### Section 2');
  logger.info(`PROCESS : Get 10 lines of log data with the new sqlHelper class`);
  result = await sqlh.Select("SELECT * FROM dblog order by logtime desc limit ?", [ 10 ]);
  dumpLogs(result);
  // await sqlh.startTransactionRW();
  // await sqlh.commitTransaction();
  // Some time report
  timer.stopTimer();
  logger.setModule('dbtest');
  logger.info(`The total time for this run is:  ${timer.getElapsedString()}`);
  console.log('\n\n');
  process.exit(0);
}
catch(error) {
  console.log(error.message);            
  logger.error(error.message);
}
// ------------------------------------------------------------
function dumpLogs(logarray) {
  logarray.forEach(element => {
      console.log(`[${logger.levelToString(element.severity)}] ${th.getDateTimeFromDate(element.logtime)} ${element.module} ${element.message} `);      
    });  
}
