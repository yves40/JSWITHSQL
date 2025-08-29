import  { moduleSQL}  from './moduleSQL.js';
import timeHelper from '../classes/timeHelper.js'
import sqlHelper from '../classes/sqlHelper.js'
import Logger from '../classes/logger.js';
import Timer from '../classes/timer.js';

// Use the old logger
const logger = new Logger('dbtest');
const timer = new Timer();
const th = new timeHelper()
const DELAY = 3000;

console.log('\n\n');
timer.startTimer();
logger.setDatabaseTrace(true);
logger.info(`moduleSQL version : ${moduleSQL.getVersion()}` );
console.log('\n\n');


// ------------------------------------------------------------
const waiting = new Promise((res, rej) => {
  setTimeout(() => {
    res('[waiting] Delay expired');
  }, DELAY);
})

// ------------------------------------------------------------
// Direct connection mode
moduleSQL.select("SELECT * FROM users")
  .then( (payload) => {
    payload.forEach(element => {
      console.log(`USERS : [${element.id}]  ${element.firstname} ${element.lastname} email is ${element.email}`);      
    });
    console.log('\n');
    logger.setModule('SIMPLE SELECT');
    logger.info(`Users selected with direct connection query`);
  })
  .catch( (error) => {
    console.log('\n');
    logger.setModule('SIMPLE SELECT');
    logger.error(`${error}`);
  })
// ------------------------------------------------------------
// Pooling mode
moduleSQL.poolSelect("SELECT * FROM users order by firstname")
.then( payload => {
    logger.setModule('POOL SELECT');
    payload.forEach(element => {
      console.log(`USERS : [${element.id}] ${element.firstname} ${element.lastname} email is ${element.email}`);      
    });
    console.log('\n');
    logger.info(`Users selected with a pooled connection query`);
  })
  .catch( (error) => {
    console.log('\n');
    logger.setModule('POOL SELECT');
    logger.error(`${error}`);
  })
// ------------------------------------------------------------
// Test a bind query
moduleSQL.poolSelect("SELECT * FROM users where firstname like ? order by firstname",['y%'])
.then( payload => {
    logger.setModule('POOL SELECT with BIND');
    payload.forEach(element => {
      console.log(`USERS : [${element.id}] ${element.firstname} ${element.lastname} email is ${element.email}`);      
    });
    console.log('\n');
    logger.info(`Users with fisrt name like 'y'`);
  })
  .catch( (error) => {
    console.log('\n');
    logger.setModule('POOL SELECT with BIND');
    logger.error(`${error}`);
  })
// ------------------------------------------------------------
// Test a join
const joinquery = 'SELECT u.email, rl.name, rl.level \
                    FROM users u, users_roles r, roles rl \
                    WHERE u.id = r.users_id and rl.id = r.roles_id'
                    moduleSQL.poolSelect(joinquery)
    .then( payload => {
      logger.setModule('POOL SELECT with JOIN');
      logger.info(`List Users roles`);
      payload.forEach(element => {
        console.log(`USERS ROLES : [${element.email}] \t\t ${element.name} \t ${element.level} `);      
    });
    console.log('\n');
  // Now test INSERT
  const now = th.getDateTime();  
// ------------------------------------------------------------
// Wait for previous tasks to finish
Promise.all([waiting]).then((result) => {
    // Yet another query on dblog
    logger.info(`Now select few rows from the dblog table`);
    moduleSQL.select("SELECT * FROM dblog order by logtime desc limit 30")
    .then( (payload) => {
        logger.setModule('FINAL SELECT on dblog');
        dumpLogs(payload);
        console.log('\n\n');
        /*
          Test another mode for waiting select calls
        */
        ( async ( ) => {
          let result = await testAwait();
          dumpLogs(result);
          logger.setModule('FINAL SELECT dblog async/await');
          logger.info(`Get log data with await/async method`);


          // *************************************************************
          // Class test now
          // *************************************************************
          try {
            logger.setModule('Class test');
            logger.info(`Got log data with the new sqlHelper class`);
            const sqlh = new sqlHelper();
            // logger.error(`Volontaire`);
            result = await sqlh.Select("SELECT * FROM dblog order by logtimee desc limit 30");
            dumpLogs(result);
          }
          catch(error) {
            console.log(error.message);            
            logger.error(error.message);
          }
          

          // Some time report
          timer.stopTimer();
          logger.setModule('dbtest');
          logger.info(`The total time for this run is:  ${timer.getElapsedString()}`);
          console.log('\n\n');
          process.exit(0);
        })();
      })
      .catch( (error) => {
        console.log(error);
      })
  })
})

async function testAwait() {
  const result = await moduleSQL.poolSelect("SELECT * FROM dblog order by logtime desc limit 30");
  return result;    
}
function dumpLogs(logarray) {
  logarray.forEach(element => {
      console.log(`[${logger.levelToString(element.severity)}] ${th.getDateTimeFromDate(element.logtime)} ${element.module} ${element.message} `);      
    });  
}
