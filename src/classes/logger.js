/* eslint-disable no-unused-vars */
//----------------------------------------------------------------------------
//    logger.js
//----------------------------------------------------------------------------
import timeHelper from './timeHelper.js';
import  { moduleSQL}  from '../sandbox/moduleSQL.js';
import sqlHelper from './sqlHelper.js'

export default class Logger {

    static LOGGERLEVEL = 1; // Default logger level is informational

    // logger levels
    static DEBUG = 0;
    static INFORMATIONAL = 1;
    static WARNING = 2;
    static ERROR = 3;
    static FATAL = 4;
    static Version = 'logger:1.55, Aug 29 2025';
    static OUTFILE = '/tmp/' + this.Version.replace(/[,:]/g,'_').replace(/ /g, '_') + '.log'

    constructor(module = 'logger') {
        this.dateHelper = new timeHelper();
        this.module = module;   // Trace the caller module signature : default is logger
        this.dbtrace = false;        // Should we also trace to a dblog table ? 
        this.sqlh = new sqlHelper();
    }
    setModule(module) {this.module = module;}
    setDatabaseTrace(activatedblog) {
        this.dbtrace = activatedblog ? true : false;
    }
    /**
     * 
     * @param {*} mess The message
     * @returns 
     */
    debug(mess) {
        this.log(mess, Logger.DEBUG);
        return;
    }
    info(mess) {
        this.log(mess, Logger.INFORMATIONAL);
        return;
    }
    warning(mess) {
        this.log(mess, Logger.WARNING);
        return;
    }
    error(mess) {
        this.log(mess, Logger.ERROR);
        return;
    }
    fatal(mess) {
        this.log(mess, Logger.FATAL);
        return;
    }
    /**
     * @param {*} level Convert numeric level to a DIWEF string
     * @returns The corresponding string
     */
    levelToString(level = this.LOGGERLEVEL) {
        switch (level) {
            case Logger.DEBUG: return 'DBG';
            case Logger.INFORMATIONAL: return 'INF';
            case Logger.WARNING: return 'WRN';
            case Logger.ERROR: return 'ERR';
            case Logger.FATAL: return 'FTL';
            default: return 'FTL';
        }
    }
    /**
     * @param {*} mess The message 
     * @param {*} level The message level in the DIWEF specification
     * @returns 
     */
    log(mess, level) {
        // Output message
        console.log(`[${this.levelToString(level)}] ${this.dateHelper.getDateTime()} [${this.module}]  : ${mess}`);
        if(this.dbtrace) {
            this.logToDatabase(mess, level);
        }
        return;
    }
    /**
     * @param {*} mess The message 
     * @param {*} level The message level in the DIWEF specification
     * @returns 
    */
    logToDatabase(mess, level) {
        const now = this.dateHelper.getDateTime();
        ( async () => {
            try {
                await this.sqlh.startTransactionRW();
                const status = await this.sqlh.Insert(`insert into bomerledb.dblog (action, logtime, message, module, severity, useremail, utctime ) 
                    values ( ?, str_to_date(?, '%M-%d-%Y %H:%i:%s'), ?, ?, ?, ?, str_to_date(?, '%M-%d-%Y %H:%i:%s') )`,
                        [ this.module, 
                            now, 
                            mess, 
                            this.module, 
                            level,
                            'logger@nomail.com', 
                            now
                        ]
                );
                await this.sqlh.commitTransaction();
            }
            catch(error) {
                await this.sqlh.rollbackTransaction();
                console.log(error);
            }
        })();
    }
    async getLatestDBlogs(range) {
        const result = await this.sqlh.Select("SELECT * FROM dblog order by logtime desc limit ?",
            [range]
        );
        return result;
    }
}
