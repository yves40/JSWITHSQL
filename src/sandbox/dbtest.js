import  { moduleSQL}  from './moduleSQL.js';
import timeHelper from '../classes/timeHelper.js'
import Logger from '../classes/logger.js';
import Timer from '../classes/timer.js';

// Use the old logger
const logger = new Logger('dbtest');
const timer = new Timer();
const th = new timeHelper()
const DELAY = 6000;

console.log('\n\n');
timer.startTimer();
logger.info(`Current version of the sql module : ${moduleSQL.getVersion()}` );
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
      logger.info(`Users selected with direct connection query\n`);
    })
    .catch( (error) => {
      console.log('\n');
      logger.error(`${error}\n`);
    })
// ------------------------------------------------------------
// Pooling mode
moduleSQL.poolSelect("SELECT * FROM users order by firstname")
  .then( payload => {
    payload.forEach(element => {
      console.log(`USERS : [${element.id}] ${element.firstname} ${element.lastname} email is ${element.email}`);      
    });
    console.log('\n');
    logger.info(`Users selected with a pooled connection query\n`);
  })
  .catch( (error) => {
      console.log('\n');
      logger.error(`${error}\n`);
  })
// ------------------------------------------------------------
// Test a bind query
moduleSQL.poolSelect("SELECT * FROM users where firstname like ? order by firstname",['y%'])
  .then( payload => {
    payload.forEach(element => {
      console.log(`USERS : [${element.id}] ${element.firstname} ${element.lastname} email is ${element.email}`);      
    });
    console.log('\n');
    logger.info(`Users with fisrt name like 'y'\n`);
  })
  .catch( (error) => {
      console.log('\n');
      logger.error(`${error}\n`);
  })
// ------------------------------------------------------------
// Test a join
const joinquery = 'SELECT u.email, rl.name, rl.level \
                    FROM users u, users_roles r, roles rl \
                    WHERE u.id = r.users_id and rl.id = r.roles_id'

moduleSQL.poolSelect(joinquery)
  .then( payload => {
    payload.forEach(element => {
      console.log(`USERS ROLES : [${element.email}] \t\t ${element.name} \t ${element.level} `);      
    });
    console.log('\n');
    logger.info(`Users roles\n`);
  // Now test INSERT
  const now = th.getDateTime();
  
  moduleSQL.poolRW()
    .then( () => {
      // moduleSQL.poolInsert('insert into bomerledb.dblog (action, logtime, message, module, severity, useremail, utctime )',
      //       ['testjs', `str_to_date('${now}', '%M-%d-%Y %H:%i:%s')`, 'test de la librairie mysql2', 'dbtest', 1,
      //          'yves@free.fr', `str_to_date('${now}', '%M-%d-%Y %H:%i:%s')`]
      // )
      logger.info(`[INSERT] date format is ${now}`)
      moduleSQL.poolInsert(`insert into bomerledb.dblog (action, logtime, message, module, severity, useremail, utctime ) 
        values ( ?, str_to_date(?, '%M-%d-%Y %H:%i:%s'), ?, ?, ?, ?, str_to_date(?, '%M-%d-%Y %H:%i:%s') )`,
            [ 'testjs', 
              now, 
              'test de la librairie mysql2', 
              'dbtest', 
              1,
              'yves@free.fr', 
              now, 
            ]
      )
      .then( (result) => {
        moduleSQL.poolCommit()
        .then( () => {
          logger.info(`[INSERT] ${result}`);
        })
      })
      .catch( (error) => {
        logger.error(`[INSERT] ${error}`);
      })
    })
    .catch( (error) => {
      console.log(error);
    })
  })
  .catch( (error) => {
      console.log('\n');
      logger.error(`${error}\n`);
  })
// ------------------------------------------------------------
// Wait for previous tasks to finish
Promise.all([waiting]).then((result) => {
    // Yet another query on dblog
    logger.debug(`Now select few rows from the dblog table`);
    console.log('\n');
    moduleSQL.select("SELECT * FROM dblog order by logtime desc limit 5")
      .then( (payload) => {
        payload.forEach(element => {
          console.log(`DBLOG : ${logger.levelToString(element.severity)} ${element.message} : ${th.getDateTimeFromDate(element.logtime)}`);      
        });
        console.log('\n\n');
        // Some time report
        timer.stopTimer();
        logger.info(`The total time for this run is:  ${timer.getElapsedString()}`);
        console.log('\n\n');
        process.exit(0);
      })
      .catch( (error) => {
        console.log(error);
      })
  } 
);
