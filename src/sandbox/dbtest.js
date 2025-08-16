const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ quiet: true });

console.log(`**************** ${process.env.DBHOST}`);
console.log(`**************** ${process.env.DBPORT}`);
console.log(`**************** ${process.env.DBUSER}`);
console.log(`**************** ${process.env.DBPASS}`);
console.log(`**************** ${process.env.DBNAME}`);

const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const dbname = process.env.DBNAME;
const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;



const promise1 = Promise.resolve(123);

promise1.then((value) => {
  console.log(value);
  // Expected output: 123
});

// ----------------------------------------------------------------------------------------
let theconnection = null;
let thepool = null;
// ----------------------------------------------------------------------------------------
mysql.createConnection({
  host: dbhost, 
  port: dbport,
  database: dbname,
  user: dbuser,
  password: dbpass
})
.then(connection => {
    theconnection = connection;
    console.log(`Connected now with user ${dbuser} on DB: ${dbname}`);
    selectSomeUser().then( result => {
      console.log(result);
      // Now test a pool
      getPool().then( result => {
        selectSomeUserWithPool().then( result  => {
          console.log(`Everything went fine with the pool`);
          selectSomeUserWithPoolManual().then(
            result  => {
              console.log(`Everything went fine with the manual pool`);
              process.exit(0);
            }
          )
        });
      })
      .catch(err =>  {
        process.exit(1);
      })
    })
    .catch((err) => {
      console.log(err)
      process.exit(1)
    });
    
}) 
.catch(error => { 
    statusmessage = 'Connection rejected';
    dbmessage = error.message;
    console.log(statusmessage +  ' / ' + dbmessage);
    process.exit(1);
})
// ----------------------------------------------------------------------------------------
async function selectSomeUser() {
    try {
      const [ rows, field ] = await theconnection.query("SELECT * FROM users");
      rows.forEach(element => {
        console.log(`DIRECT : ${element.firstname} ${element.lastname} email is ${element.email}`);      
      });
      return Promise.resolve('Everything went fine without any pool');
    }
    catch(err) {
      console.log(err);
      return Promise.reject('Got a problem here');
    }
}
// ----------------------------------------------------------------------------------------
async function selectSomeUserWithPool() {
    try {
      const [ rows, field ] = await thepool.query("SELECT * FROM users");
      rows.forEach(element => {
        console.log(`POOL : ${element.firstname} ${element.lastname} email is ${element.email}`);      
      });
      return Promise.resolve('Done with the pool');
    }
    catch(err) {
      console.log(err);
      return Promise.reject('Got a problem here');
    }
}
// ----------------------------------------------------------------------------------------
async function selectSomeUserWithPoolManual() {
    try {
      thepool.getConnection( (err, dynconn) => {
          dynconn.query("SELECT * FROM users", (err, results, fields) => {
            dynconn.release();
            if(err) {
              console.log(err);
              return Promise.reject('Got a problem here when manually using a connection from the pool');
            }
            else {
              console.log(`MANUAL : Fine select `);
              return Promise.resolve('MANUAL : Fine select ');
            }
          })
      });

      const [ rows, field ] = await thepool.query("SELECT * FROM users");
      rows.forEach(element => {
        console.log(`POOL : ${element.firstname} ${element.lastname} email is ${element.email}`);      
      });
      return Promise.resolve('Done with the pool');
    }
    catch(err) {
      console.log(err);
      return Promise.reject('Got a problem here');
    }
}
// ----------------------------------------------------------------------------------------
async function getPool() {
    try {
        const pool = mysql.createPool({
          host: dbhost, 
          port: dbport,
          database: dbname,
          user: dbuser,
          password: dbpass,
          waitForConnections: true,
          connectionLimit: 10,
          maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
          idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
          queueLimit: 0,
          enableKeepAlive: true,
          keepAliveInitialDelay: 0,
        })
        thepool = pool;
        console.log(`Fine, you got a pool !!!`);
        
    }
    catch(err) {
      console.log(err);
      Promise.reject('Got a problem here with the pool ');
    }
}

