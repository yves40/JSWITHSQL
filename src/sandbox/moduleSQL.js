/*----------------------------------------------------------------------------------
 *          moduleSQL.js
 *          
 *          Aug 19 2025     Initial
 ----------------------------------------------------------------------------------*/
"use strict";

import mysqlPromise from "mysql2/promise.js";
import dotenv from 'dotenv';


dotenv.config({ quiet: true });

const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const dbname = process.env.DBNAME;
const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;

const moduleSQL = (function () {

    //---------------- MODULE SCOPE VARIABLES --------------
    const Version = "moduleSQL.js Aug 20 2025, 1.04";
    let connection = null;
    let pool = null;
    //------------------- PRIVATE METHODS ------------------

    //------------------- PUBLIC METHODS -------------------
    function getVersion()  { return Version; }
    // -----------------------------------------------------
    function createConnection() {
      return new Promise((resolve, reject) => {
        mysqlPromise.createConnection({
          host: dbhost, 
          port: dbport,
          database: dbname,
          user: dbuser,
          password: dbpass
        })
        .then(result => {
          connection = result;
          resolve('Connection acquired');
        })
        .catch( error => {
          console.log(`KO error : ${error}`);
          reject(`Got a problem with connection ${error}`);
        })
      })
    }
    // -----------------------------------------------------
    function createPool() {
      return new Promise((resolve, reject) => {
        try {
          pool = mysqlPromise.createPool({
             host: dbhost, 
             port: dbport,
             database: dbname,
             user: dbuser,
             password: dbpass,
             waitForConnections: true,
             connectionLimit: 10,
             maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
             idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
             queueLimit: 0,
             enableKeepAlive: true,
             charset: 'utf8mb4',
             keepAliveInitialDelay: 0,
           })
           resolve('Connection pool acquired');
        }
        catch( error ) {
          console.log(`KO error : ${error}`);
          reject(`Got a problem with connection pooling ${error}`);
        }
      })
    }
    // -----------------------------------------------------
    async function select(query) {
      return new Promise((res, rej) => {
        try {
          (async () => {
            const [ rows, field ] = await connection.query(query);
            rows.forEach(element => {
              console.log(`DIRECT : ${element.firstname} ${element.lastname} email is ${element.email}`);      
            });
            res('Everything went fine in direct mode');
          })();
        }
        catch(err) {
          console.log(err);
          rej('Got a problem here');
        }
      })
    }
    // -----------------------------------------------------
    async function poolSelect(query) {
      return new Promise((res, rej) => {
        try {
          (async () => {
            const [ rows, field ] = await pool.query(query);
            rows.forEach(element => {
              console.log(`POOL : ${element.firstname} ${element.lastname} email is ${element.email}`);      
            });
            res('Everything went fine in pooling mode');
          })();
        }
        catch(err) {
          console.log(err);
          rej('Got a problem with pooling');
        }
      })
    }
    // -----------------------------------------------------
    // What is exposed outside module ? 
    // -----------------------------------------------------
    return {
        getVersion: getVersion,
        createConnection: createConnection,
        createPool: createPool,
        select: select,
        poolSelect: poolSelect
    };
}());

export { 
    moduleSQL as moduleSQL,  
};
