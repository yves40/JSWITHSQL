import  { moduleSQL}  from './moduleSQL.js';
import timeHelper from '../classes/timeHelper.js'
import Logger from '../classes/logger.js';

// Use the old logger
const logger = new Logger('dbtest');

console.log('\n\n');
logger.info(`Current version of the sql module : ${moduleSQL.getVersion()}` );
console.log('\n\n');

const waiting = new Promise((res, rej) => {
  setTimeout(() => {
    res('[waiting] Delay expired');
  }, 2000);
})

// Direct connection mode
moduleSQL.select("SELECT * FROM users")
    .then( (payload) => {
      payload.forEach(element => {
        console.log(`USERS : ${element.firstname} ${element.lastname} email is ${element.email}`);      
      });
      console.log('\n');
      logger.info(`Users selected with direct connection query\n`);
    })
    .catch( (error) => {
      console.log('\n');
      logger.error(`${error}\n`);
    })
// Pooling mode
moduleSQL.poolSelect("SELECT * FROM users order by firstname")
  .then( payload => {
    payload.forEach(element => {
      console.log(`USERS : ${element.firstname} ${element.lastname} email is ${element.email}`);      
    });
    console.log('\n');
    logger.info(`Users selected with a pooled connection query\n`);
  })
  .catch( (error) => {
      console.log('\n');
      logger.error(`${error}\n`);
  })

// Wait for previous tasks to finish
Promise.all([waiting]).then((result) => {
    // Yet another query on dblog
    logger.debug(`Now select few rows from the dblog table`);
    console.log('\n');
    moduleSQL.select("SELECT * FROM dblog order by logtime desc limit 5")
      .then( (payload) => {
        const th = new timeHelper();
        payload.forEach(element => {
          console.log(`DBLOG : ${logger.levelToString(element.severity)} ${element.message} : ${th.getDateTimeFromDate(element.logtime)}`);      
        });
        console.log('\n\n');
        process.exit(0);
      })
      .catch( (error) => {
        console.log(error);
      })
  } 
);
