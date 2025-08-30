import timeHelper from '../classes/timeHelper.js'
import sqlHelper from '../classes/sqlHelper.js'
import Logger from '../classes/logger.js';
import Timer from '../classes/timer.js';

// Use the old logger
const logger = new Logger('dbtest');
const timer = new Timer();
const th = new timeHelper()
const Version = 'dbtest:1.57, Aug 30 2025';

console.log('\n\n');
timer.startTimer();
logger.setDatabaseTrace(true);  // Log to DB
// ------------------------------------------------------------
// Class test now
// ------------------------------------------------------------
const now = th.getDateTime();

logger.setModule('DBTEST');   

// Check we only want a dump of DB logs
// usage : -node --trace-warnings dbtest.js -dump -nbrlines
// process.argv.forEach(function (val, index, array) {
//   console.log(index + ': ' + val);
// });
// Small preliminary analysis in cas you only want a dump
if(process.argv[2] === '-dump') {
  const nblines = parseInt(process.argv[3]);
  if(nblines === undefined) {
    console.log('usage: dbtest [ -dump lines]\n\n');
    process.exit(1);
  }
  else {
    const latest = await logger.getLatestDBlogs(nblines);
    dumpLogs(latest);
    timer.stopTimer();
    logger.setAction('#### Section 99: ');
    console.log('\n\n');  
    logger.info(`The total time for this run is:  ${timer.getElapsedString()}`);
    console.log('\n\n');
    process.exit(0);
  }
}

try {
  logger.setAction('#### Section 00: ');
  logger.info(`INIT :  ${Version}`);
  const sqlh = new sqlHelper();
  logger.setAction('#### Section 01: ');
  logger.info(`PROCESS : Get 30 lines of log data with the new sqlHelper class`);
  let result = await sqlh.Select("SELECT * FROM dblog order by logtimee desc limit 30");
  logger.info(`PROCESS : Selected ${result.length} lines from the DB log`)
  logger.setAction('#### Section 02: ');
  logger.info(`PROCESS : Get latest lines of log data`);
  result = await logger.getLatestDBlogs(20);
  dumpLogs(result);
  // await sqlh.startTransactionRW();
  // await sqlh.commitTransaction();
  // Some time report
  timer.stopTimer();
  logger.setAction('#### Section 99: ');
  console.log('\n\n');  
  logger.info(`END : The total time for this run is:  ${timer.getElapsedString()}`);
  console.log('Exit in 3 seconds\n\n');
  setTimeout(() => {
    process.exit(0);
  }, 3000);
}
catch(error) {
  console.log(error.message);            
  logger.error(error.message);
  setTimeout(() => {
    process.exit(0);
  }, 3000);
}
// ------------------------------------------------------------
function dumpLogs(logarray) {
  console.log('\n\nSome logs from DB\n\n');  
  logarray.forEach(element => {
      console.log(`[${logger.levelToString(element.severity)}]\
       ${th.getDateTimeFromDate(element.logtime)} Module: ${element.module} Action: ${element.action}\
        User: ${element.useremail} ${element.message} `);      
    });  
}
