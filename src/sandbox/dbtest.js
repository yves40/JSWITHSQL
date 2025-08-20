import  { moduleSQL}  from './moduleSQL.js';
import timeHelper from './timeHelper.js'
import Logger from './logger.js';

// Use the old logger
const logger = new Logger();

console.log('\n\n');
logger.info(`Current version of the sql module : ${moduleSQL.getVersion()}` );
console.log('\n\n');

const waiting = new Promise((res, rej) => {
  setTimeout(() => {
    res('[waiting] Delay expired');
  }, 8000);
})

// Direct connection mode
const cc = moduleSQL.createConnection();
cc.then( message =>  {
    console.log(message);
    moduleSQL.select("SELECT * FROM users")
      .then( (payload) => {
        console.log(`\n****** ${payload.pop()}\n`);
        payload.forEach(element => {
          console.log(`DIRECT : ${element.firstname} ${element.lastname} email is ${element.email}`);      
        });
      })
      .catch( (error) => {
        console.log(error);
      })
  })
  .catch( error => {
    console.log(error);
    process.exit(1);
  });
// Pooling mode
const cp = moduleSQL.createPool();
cp.then(
    message =>  {
    console.log(message);
    moduleSQL.poolSelect("SELECT * FROM users order by firstname")
      .then( payload => {
        console.log(`\n****** ${payload.pop()}\n`);
        payload.forEach(element => {
          console.log(`POOL: ${element.firstname} ${element.lastname} email is ${element.email}`);      
        });
      })
      .catch( (error) => {
        console.log(error);
      })
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });

// Wait for previous tasks to finish
Promise.all([waiting]).then((result) => {
    // Yet another query on dblog
    logger.debug(`Now select few rows from the dblog table`)
    moduleSQL.select("SELECT * FROM dblog order by logtime desc limit 10")
      .then( (payload) => {
        const th = new timeHelper();
        console.log(`\n****** ${payload.pop()}\n`);
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
