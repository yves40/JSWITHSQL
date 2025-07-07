"use server"

const mysql = require('mysql');

const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;
let connection = null;

export async function mysqlConnect() {
      return { status: "connected" };
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
