const mysql = require('mysql2/promise');

class MySQLDBConnector {
    static instance;
    pool;

    constructor () {
        this.pool = mysql.createPool({
            host: '127.0.0.1',
            port: 3306,
            user: 'sam',
            password: 'pwd',
            database: 'the_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            charset: 'utf8mb4',
            multipleStatements: true
        });
    }

    static getInstance() {
        if (!MySQLDBConnector.instance) {
            MySQLDBConnector.instance = new MySQLDBConnector();
        }
        return MySQLDBConnector.instance;
    }

    getPool() {
        return this.pool;
    }

    async connect() {
        try {
            const connection = await this.pool.getConnection();
            console.log('Connected to the MySQL database.');
            connection.release();
        } catch (err) {
            console.error('Unable to connect to the database:', err);
        }
    }

    // the query wrapper that mimics the callback structure
    async query(sql, params = [], callback = async (error, results) => { }) {
        try {
            const [results] = await this.pool.query(sql, params);
            return callback(null, results);
        } catch (error) {
            return callback(error, null);
        }
    }
}

module.exports = MySQLDBConnector;