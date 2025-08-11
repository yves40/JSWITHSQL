"use server"
const mysql = require('mysql2/promise');


const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const dbname = process.env.DBNAME;
const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;

let statusmessage = '';
let dbmessage = '';
let isconnected = false;
let theconnection = null;

// ---------------------------------------------------------------------------------
export async function mysqlConnect() {
  return new Promise( (resolve, reject) => {
    mysql.createConnection({
      host: dbhost, 
      port: dbport,
      database: dbname,
      user: dbuser,
      password: dbpass
    })
    .then(connection => {
        theconnection = connection;
        isconnected = true;
        statusmessage = `Connected now with user ${dbuser} on DB: ${dbname}`;
        resolve(statusmessage);
      })
    .catch(error => { 
        theconnection = null;
        isconnected = false;
        statusmessage = 'Connection rejected';
        dbmessage = error.message;
        reject(new Error(statusmessage +  '@***@' + dbmessage ));
        // reject(new Error(statusmessage, { cause: dbmessage} ));
    })
  })
}
// ---------------------------------------------------------------------------------
export async function mysqlDisconnect() {
  try {
    let connection = await mysql.quit();
    return {
      status: true,
      message: 'Disconnected'
    }
  }
  catch (err) {
    return {
      status: false,
      error: err
    }
  }
}
