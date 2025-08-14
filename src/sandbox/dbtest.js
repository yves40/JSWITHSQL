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

// ----------------------------------------------------------------------------------------
let theconnection = null;
// ----------------------------------------------------------------------------------------
mysql.createConnection({
  host: dbhost, 
  port: dbport,
  database: dbname,
  user: dbuser,
  password: dbpass
})
.then(connection => {
    statusmessage = `Connected now with user ${dbuser} on DB: ${dbname}`;
    theconnection = connection;
    console.log(statusmessage);
    selectSomeUser().then( result => {
      console.log(result);
       process.exit(0);
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
        console.log(`${element.firstname} ${element.lastname} email is ${element.email}`);      
      });
      Promise.resolve('Done');
    }
    catch(err) {
      console.log(err);
      Promise.reject('Got a problem here');
    }
}

