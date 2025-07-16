const mysql = require('mysql');

const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;
let connection = null;

export function mysqlConnect() {
  let con = mysql.createConnection({
    host: dbhost,
    port: dbport,
    user: dbuser,
    password: dbpass
  });

  return new Promise((resolve, reject) => {
    con.connect(function(err) {
      if (err) {
        reject({ 
          error: true,
            status: "Sorry, an error has been triggered" ,
            message: err
        }) 
      }
      else {
        resolve({ 
          error: false,
            status: "Connected" ,
            message: ""
        }) 
      }
    });      
  })
}

export async function mysqlDisconnect() {

  if(connection) {
    return new Promise((resolve, reject) => {
        connection.end((err) => {
          if (err)
            reject({ 
              error: true,
                status: "Disconnection failed" ,
                message: err
            }) 
          connection = null;
            resolve({ 
              error: false,
                status: "Disconnection" ,
                message: ''
            }) 
        });
    })
  }
}
