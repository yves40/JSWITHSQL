"use strict";

import mysqlPromise from "mysql2/promise.js";
import dotenv from 'dotenv';


export default class sqlHelper {

  
  #dbhost = process.env.DBHOST;
  #dbport = process.env.DBPORT;
  #dbname = process.env.DBNAME;
  #dbuser = process.env.DBUSER;
  #dbpass = process.env.DBPASS;
  #pool = null;
  
  constructor() {
    this.Version = "sqlHelper.js Aug 29 2025, 1.02";
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
          const [ rows ] = await this.#pool.query(query, params);
          resolve(rows) ;
        }
        catch(error) {
          reject(error);
        }
      })();
    });
  }
  // ------------------------------------------------------------------------
  Insert(sql, params = null) {
    return new Promise((resolve, reject) => {
      (async () => {
        await this.#checkPool();
        try {
          const [ result, fields ] = await this.#pool.execute(sql, params);
          resolve(true) ;
        }
        catch(error) {
          reject(error);
        }
      })();
    });
  }
  // ------------------------------------------------------------------------
  startTransactionRW() {
    return new Promise((resolve, reject) => {
      (async () => {
        await this.#checkPool();
        try {
              await this.#pool.execute('set transaction read write');
              resolve(true);
        }
        catch(err) {
          reject(`${err.message}`);
        } 
      })();
    });
  }
  // ------------------------------------------------------------------------
  rollbackTransaction() {
    return new Promise((resolve, reject) => {
      (async () => {
        await this.#checkPool();
        try {
              await this.#pool.execute('rollback');
              resolve(true);
        }
        catch(err) {
          reject(`${err.message}`);
        } 
      })();
    });
  }
  // ------------------------------------------------------------------------
  commitTransaction() {
    return new Promise((resolve, reject) => {
      (async () => {
        await this.#checkPool();
        try {
              await this.#pool.execute('commit');
              resolve(true);
        }
        catch(err) {
          reject(`${err.message}`);
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
          });
          this.#setPool(pool);
          const conn = pool.getConnection();
          resolve(pool);
      }
      catch( error ) {
        reject(`Got a problem with connection pooling ${error}`);
      }
    })
  }
  // ------------------------------------------------------------------------
  #setPool(pool) {
    this.#pool = pool;
  }
  // ------------------------------------------------------------------------
  #checkPool() {
    return new Promise((resolve, reject) => {
      if(this.#pool === null) {
        console.log(`*** POOL MUST BE CREATED *** `);
        (async () => {
           try {
             await this.#createPool();
             console.log(`*** POOL CREATED *** `);
             resolve(false);
           }
           catch( error ) {
             console.log(`*** POOL ACQUISITION ERROR *** ${error}`);
             reject(error);
           }
         })();
      }
      else {
      console.log(`*** POOL EXISTS *** `);
       resolve(true);
      }
    })
  }
}