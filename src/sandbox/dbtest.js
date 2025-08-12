const mysql = require('mysql2/promise');
const dotenv = require('dotenv');


dotenv.config({ quiet: true });

console.log(`**************** ${process.env.DBHOST}`);
console.log(`**************** ${process.env.DBPORT}`);
console.log(`**************** ${process.env.DBUSER}`);
console.log(`**************** ${process.env.DBPASS}`);
console.log(`**************** ${process.env.DBNAME}`);

let con = mysql.createConnection({
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    result.forEach(element => {
      console.log(`${element.firstname} ${element.lastname} email is ${element.email}`);      
    });
    process.exit(0);
  });
});
