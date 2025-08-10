const mysql = require('mysql2/promise');

const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;
const DBNAME = process.env.DBNAME;

export async function GET(request) {
  
  let connection = await mysql.createConnection({
    host: dbhost, 
    port: dbport,
    database: DBNAME,
    user: dbuser,
    password: dbpass
  });
  const status = await connection.connect();
  try {
    const [results, fields] = await connection.query(
      'SELECT * FROM users order by email'
    );
    return new Response(JSON.stringify({
      status: true,
      data: results
    }))
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({
      status: false,
      error: err
    }))
  }
  //     // setDbctx({loading: false, connectd: false})
}
