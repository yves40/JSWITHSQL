import  { moduleSQL}  from './moduleSQL.js';
import timeHelper from './timeHelper.js'
import Logger from './logger.js';

console.log(`\nCurrent version of the sql module : ${moduleSQL.getVersion()} \n\n` );

const waiting = new Promise((res, rej) => {
  setTimeout(() => {
    res('Delay expired');
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
// Yet another query on dblog
// Use the old logger
const logger = new Logger();
logger.debug(`Now select few rows from the dblog table`)
moduleSQL.select("SELECT * FROM dblog order by logtime desc limit 10")
  .then( (payload) => {
    const th = new timeHelper();
    console.log(`\n****** ${payload.pop()}\n`);
    payload.forEach(element => {
      console.log(`DBLOG : ${logger.levelToString(element.severity)} ${element.message} : ${th.getDateTimeFromDate(element.logtime)}`);      
    });
  })
  .catch( (error) => {
    console.log(error);
  })

// Wait for all tasks to finish
Promise.all([waiting]).then(
  (result) => {
    console.log(result);    
    process.exit(0)
  } 
);
