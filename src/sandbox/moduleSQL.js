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
    const Version = "moduleSQL.js Aug 20 2025, 1.05";
    let connection = null;
    let pool = null;
    //------------------- PRIVATE METHODS ------------------
    async function getData(query, res, rej, conn = connection ) {
        try {
          const [ rows ] = await conn.query(query);
          res(rows);
        }
        catch(err) {
          rej(`Got a problem here : ${err.message}`);
        }
    }
    //------------------- PUBLIC METHODS -------------------
    function getVersion()  { return Version; }
    // -----------------------------------------------------
    function createConnection() {
      return new Promise((resolve, reject) => {
        if(connection !== null) {
          resolve('Connection alread acquired');
        }
        mysqlPromise.createConnection({
          host: dbhost, 
          port: dbport,
          database: dbname,
          user: dbuser,
          password: dbpass
        })
        .then(result => {
          connection = result;
          resolve('[createConnection] Connection acquired');
        })
        .catch( error => {
          reject(`[createConnection] Got a problem with connection ${error}`);
        })
      })
    }
    // -----------------------------------------------------
    function createPool() {
      return new Promise((resolve, reject) => {
        if(pool !== null) {
          resolve('Pool already acquired');
        }
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
           resolve('[createPool] Connection pool acquired');
        }
        catch( error ) {
          reject(`[createPool] Got a problem with connection pooling ${error}`);
        }
      })
    }
    // -----------------------------------------------------
    async function select(query) {
      return new Promise((res, rej) => {
        if(connection === null) {
          createConnection()
            .then( result => {
              getData(query, res, rej);
            })
        }
        else {
          getData(query, res, rej);
        }
      })
    }
    // -----------------------------------------------------
    async function poolSelect(query) {
      return new Promise((res, rej) => {
        if(pool === null ) {
          createPool()
          .then( result => {
            getData(query, res, rej, pool );
          })
        }
        else {
          getData(query, res, rej, pool);
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
