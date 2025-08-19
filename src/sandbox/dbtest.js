import  { moduleSQL}  from './moduleSQL.js';

console.log(`\nCurrent version of the sql module : ${moduleSQL.getVersion()} \n\n` );

let action1, action2;

// Direct connection mode
moduleSQL.createConnection()
  .then( message =>  {
    console.log(message);
    action1 = moduleSQL.select("SELECT * FROM users")
      .then( result =>  { 
        console.log(result);
        // process.exit(0);
      })
      .catch( error => {
        console.log(error);
        process.exit(1);
      });
  })
  .catch( error => {
    console.log(error);
    process.exit(1);
  });
// Pooling mode
moduleSQL.createPool()
  .then(
    message =>  {
    console.log(message);
    action2 = moduleSQL.poolSelect("SELECT * FROM users order by lastname")
      .then( result =>  { 
        console.log(result);
        // process.exit(0);
      })
      .catch( error => {
        console.log(error);
        process.exit(1);
      });
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });

// Wait for all tsaks to finish
Promise.all([action1, action2]).then( () => process.exit(0));
