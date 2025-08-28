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
    const Version = "moduleSQL.js Aug 21 2025, 1.06";
    let connection = null;
    let pool = null;
    //------------------- PRIVATE METHODS ------------------
    async function getData(query, res, rej, conn = connection,  params ) {
        try {
          if(params === null) {
            const [ rows ] = await conn.query(query);
            res(rows);
          }
          else {
            const [ rows ] = await conn.query(query, params);
            res(rows);
          }
        }
        catch(err) {
          rej(`Got a problem on SELECT : ${err.message}`);
        }
    }
    //------------------- PUBLIC METHODS -------------------
    function getVersion()  { return Version; }
    // -----------------------------------------------------
    function createConnection() {
      return new Promise((resolve, reject) => {
        if(connection !== null) {
          resolve('Connection already acquired');
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
            .catch(error => {
              console.log(error);
            })
        }
        else {
          getData(query, res, rej);
        }
      })
    }
    // -----------------------------------------------------
    async function poolSelect(query, params = null) {
      return new Promise((res, rej) => {
        if(pool === null ) {
          createPool()
            .then( result => {
              getData(query, res, rej, pool, params  );
            })
            .catch(error => {
              console.log(error);              
            })
        }
        else {
          getData(query, res, rej, pool, params);
        }
      })
    }
    // -----------------------------------------------------
    async function poolInsert(sql, params = null) {
      return new Promise((res, rej) => {
        if(pool === null ) {
          createPool()
            .then( result => {
              InsertData(sql, res, rej, pool, params);
            })
            .catch(error => {
              console.log(error);              
            })
        }
        else {
            InsertData(sql, res, rej, pool, params);
        }
        async function InsertData(sql, res, rej, pool, params) {
        try {
            if(params === null) {
              const [ result, fields ] = await pool.execute(sql);
              res('Insert done');              
            }
            else {
              const [ result, fields ] = await pool.execute(sql, params);
              res('Insert done');              
            }
          }
          catch(err) {
            rej(`Got a problem on INSERT : ${err.message}`);
          } 
        }
      })
    }
    // -----------------------------------------------------
    async function poolRW() {
      return new Promise((res, rej) => {
        if(pool === null ) {
          createPool()
            .then( result => {
              RW(res, rej);
            })
            .catch(error => {
              console.log(error);              
            })
        }
        else {
            RW(res, rej);
        }
        async function RW(res, rej) {
        try {
              await pool.execute('set transaction read write');
              res('Read write transaction started');
        }
        catch(err) {
          rej(`Got a problem on RW transaction : ${err.message}`);
        } 
        }
      })
    }
    // -----------------------------------------------------
    async function poolCommit() {
      return new Promise((res, rej) => {
        if(pool === null ) {
          createPool()
            .then( result => {
              Commit(res, rej);
            })
            .catch(error => {
              console.log(error);              
            })
        }
        else {
            Commit(res, rej);
        }
        async function Commit(res, rej) {
        try {
              await pool.execute('commit');
              res('Transation committed')
        }
        catch(err) {
          await poolRollback();
          rej(`Got a problem comitting transaction : ${err.message}`);
        } 
        }
      })
    }
    // -----------------------------------------------------
    async function poolRollback() {
      return new Promise((res, rej) => {
        if(pool === null ) {
          createPool()
            .then( result => {
              Rollback(res, rej);
            })
            .catch(error => {
              console.log(error);              
            })
        }
        else {
            Rollback(res, rej);
        }
        async function Rollback(res, rej) {
        try {
              await pool.execute('corollbackmmit');
              res('Transation canceled');
        }
        catch(err) {
          rej(`Got a problem canceling transaction : ${err.message}`);
        } 
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
        poolSelect: poolSelect, 
        poolInsert: poolInsert, 
        poolRW: poolRW,
        poolCommit: poolCommit,
        poolRollback: poolRollback
    };
}());

export { 
    moduleSQL as moduleSQL,  
};
