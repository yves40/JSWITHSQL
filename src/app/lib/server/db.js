"use server"
const mysql = require('mysql2/promise');

const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const DBNAME = process.env.DBNAME;
const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;

let connection = null;

export async function mysqlConnect() {
  try {
    let connection = await mysql.createConnection({
      host: dbhost, 
      port: dbport,
      database: DBNAME,
      user: dbuser,
      password: dbpass
    });
    const result = await connection.connect();
    return {
      status: true,
      message: 'I am connected'
    }
  }
  catch (err) {
    return {
      status: false,
      error: err
    }
  }
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
