"use strict";

import mysqlPromise from "mysql2/promise.js";
import dotenv from 'dotenv';


export default class sqlHelper {

  
  #dbhost = process.env.DBHOST;
  #dbport = process.env.DBPORT;
  #dbname = process.env.DBNAME;
  #dbuser = process.env.DBUSER;
  #dbpass = process.env.DBPASS;
  
  constructor() {
    this.Version = "sqlHelper.js Aug 28 2025, 1.01";
    this.pool = null;
    
    dotenv.config({ quiet: true });
    
  }

  // ------------------------------------------------------------------------
  //      P U B L I C 
  // ------------------------------------------------------------------------
  Select(query, params = null) {
    return new Promise((resolve, reject) => {
      (async () => {
        await this.#checkPool();
        try {
          const [ rows ] = await this.pool.query(query, params);
          resolve(rows) ;
        }
        catch(error) {
          console.log(`*** SELECT ERROR *** ${error}`);
          reject(error);
        }
      })();
    });
  }
  // ------------------------------------------------------------------------
  //      P R I V A T E 
  // ------------------------------------------------------------------------
  #createPool() {
    return new Promise((resolve, reject) => {
      try {
        const pool = mysqlPromise.createPool({
            host: this.#dbhost, 
            port: this.#dbport,
            database: this.#dbname,
            user: this.#dbuser,
            password: this.#dbpass,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
            idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
            queueLimit: 0,
            enableKeepAlive: true,
            charset: 'utf8mb4',
            keepAliveInitialDelay: 0,
          })
          resolve(pool);
      }
      catch( error ) {
        reject(`Got a problem with connection pooling ${error}`);
      }
    })
  }
  // ------------------------------------------------------------------------
  #checkPool() {
    return new Promise((resolve, reject) => {
      if(this.pool === null) {
        (async () => {
           try {
             this.pool = await this.#createPool();
             console.log(`*** POOL CREATED *** `);
             resolve(true)
           }
           catch( error ) {
             console.log(`*** POOL ACQUISITION ERROR *** ${error}`);
             reject(false);
           }
         })();
      }
      else {
        resolve(true);
      }
    })
  }
}