const mysql = require('mysql');

const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;
let connection = null;

export async function mysqlConnect() {
  let con = mysql.createConnection({
    host: dbhost,
    port: dbport,
    user: dbuser,
    password: dbpass
  });
  await con.connect(function(err) {
    if (err) {
      return { 
          status: "Disconnected" ,
          message: err
      };
    }
    else {
      return { 
          status: "Connected" ,
          message: "No error"
      };
    }
  });      
  // return { 
  //     status: "KAPUT" ,
  //     message: "Kaput"
  // };
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
