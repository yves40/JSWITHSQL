"use server"
const mysql = require('mysql2/promise');


const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const dbname = process.env.DBNAME;
const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;

let connection = null;

export async function mysqlConnect() {
  const feedback = '';
  return new Promise( (resolve, reject) => {
    mysql.createConnection({
      host: dbhost, 
      port: dbport,
      database: dbname,
      user: dbuser ,
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
          message: error,
          techmessage: ''
        })
      })
    })
    .catch(error => { 
        reject({
          connected: false,
          message: 'An error occured during connection',
          techmessage: JSON.stringify(error)
        })
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
