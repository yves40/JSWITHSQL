"use server"
const mysql = require('mysql2/promise');


const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const dbname = process.env.DBNAME;
const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;

let connection = null;

export async function mysqlConnect() {
  return new Promise( (resolve, reject) => {
    mysql.createConnection({
      host: dbhost, 
      port: dbport,
      database: dbname,
      user: dbuser + "lflfllf",
      password: dbpass
    })
    .then(connection => {
      connection.connect()
      .then(result => {
        resolve({
          connected: true,
          message: `Connected now with user ${dbuser} on DB: ${dbname}`
        })
      })
      .catch(error => {
        reject({
          connected: false,
          message: 'Connection rejected',
          techmessage: ''
        })
      })
    })
    .catch(error => { 
      console.log(`***************** ${error.message}`);
        // reject(new Error('Connection rejected'))
        reject(new Error(error.message))
    })
  })
}

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
