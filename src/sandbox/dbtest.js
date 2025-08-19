import mysqlPromise from "mysql2/promise.js";
import dotenv from 'dotenv';
import { moduletemplate } from './moduletemplate.js';

dotenv.config({ quiet: true });

const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const dbname = process.env.DBNAME;
const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;


// Test with module

console.log(moduletemplate.getVersion());


// ----------------------------------------------------------------------------------------
let theconnection = null;
let thepool = null;
// ----------------------------------------------------------------------------------------
mysqlPromise.createConnection({
  host: dbhost, 
  port: dbport,
  database: dbname,
  user: dbuser,
  password: dbpass
})
.then(connection => {
    theconnection = connection;
    console.log(`Connected now with user ${dbuser} on DB: ${dbname}`);
    // *********
    selectSomeUser().then( result => {
      console.log(result);
      // Now test a pool
      getPool().then( result => {
      // *********
        selectSomeUserWithPool().then( result  => {
          console.log(`Everything went fine with the pool`);
        // *********
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
      return Promise.resolve('Everything went fine in direct mode');
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
  return new Promise( ( resolve, reject ) => {
    thepool.getConnection(function(err, conn) {
      if (err) throw err; // not connected!

      // Use the connection
      conn.query('SELECT * FROM users', function (error, results) {
        conn.release();
        if (error) throw error;
      });
    });
    resolve('********************* ');
  });

    // try {
    //   thepool.getConnection( function (err, dynconn) {
    //       if(err) {
    //         console.log(err);
    //         return Promise.reject('Got a problem here getConnection() from the pool');
    //       }
    //      dynconn.query("SELECT * FROM users", (err, results) => {
    //         dynconn.releaseConnection();
    //         if(err) {
    //           console.log(err);
    //           return Promise.reject('Got a problem here when manually using a connection from the pool');
    //         }
    //         else {
    //           results.forEach(element => {
    //             console.log(`MANUAL POOL : ${element.firstname} ${element.lastname} email is ${element.email}`);      
    //           });
    //           return Promise.resolve('MANUAL POOL: Fine select ');
    //         }
    //       })
    //   });
    // }
    // catch(err) {
    //   console.log(err);
    //   return Promise.reject('Got a problem here');
    // }
}
// ----------------------------------------------------------------------------------------
async function getPool() {
    try {
        const pool = mysqlPromise.createPool({
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
          charset: 'utf8mb4',
          keepAliveInitialDelay: 0,
        })
        thepool = pool;
        // console.log(`Fine, you got a pool !!!`);
        
    }
    catch(err) {
      console.log(err);
      Promise.reject('Got a problem here with the pool ');
    }
}

