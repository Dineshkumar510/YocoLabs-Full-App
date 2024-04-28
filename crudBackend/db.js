const mysql = require('mysql2');

const mysqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'users_db',
})

module.exports = mysqlPool.promise();