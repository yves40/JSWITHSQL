import  { moduleSQL}  from './moduleSQL.js';

console.log(`\nCurrent version of the sql module : ${moduleSQL.getVersion()} \n\n` );

let action1, action2;
const waiting = new Promise((res, rej) => {
  setTimeout(() => {
    res('Delay expired');
  }, 5000);
})

// Direct connection mode
const cc = moduleSQL.createConnection();
cc.then( message =>  {
    console.log(message);
    action1 = moduleSQL.select("SELECT * FROM users")
      .then( message => {
        console.log(message);
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
    action2 = moduleSQL.poolSelect("SELECT * FROM users order by firstname")
      .then( message => {
        console.log(message);
      })
      .catch( (error) => {
        console.log(error);
      })
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });

// Wait for all tsaks to finish
Promise.all([action1, action2, waiting]).then(
  (result) => {
    console.log(result);    
    process.exit(0)
  } 
);
