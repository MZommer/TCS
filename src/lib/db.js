const { promisify } = require('util');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sql.db');
console.log("Connected to SQLite database");

const db_all = promisify(db.all).bind(db);
const db_get = promisify(db.get).bind(db);
const db_exec = promisify(db.exec).bind(db);
const db_run = promisify(db.run).bind(db);

module.exports = class DB {
    
}