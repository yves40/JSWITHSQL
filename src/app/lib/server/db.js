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
  // console.log(`************** Connect on ${dbhost}/${dbport}`);
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
          message: "No error"
      }) 
    }
  });      

  })
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
