"use server"

const mysql = require('mysql');

const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;
let connection = null;

export async function mysqlConnect() {

  console.log(`Connection to mysql on ${dbhost} with user ${dbuser}`);  
  connection = mysql.createConnection({
      host: dbhost,
      port: dbport,
      user: dbuser,
      password: dbpass,
      timezone: 'utc',
      charset : 'utf8'
  });

  try {
    connection.connect(function(err) {
      if (err) throw err;
      console.log(`************ Connected `); 
      return { status: "connected" };
    });
  }
  catch(error) {
    console.log(error.message);
    return { status: "error"};
  }
}

export async function mysqlDisconnect() {

  if(connection) {
    try {
      connection.end((err) => {
        if (err) throw err;
        connection = null;
        console.log(`************ Disconnected `); 
        return { status: "Disconnected" };
      });
    }
    catch(error) {
      console.log(error.message);
      return { status: "error" };    
    }
  }
}
