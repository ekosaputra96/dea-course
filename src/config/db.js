const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

connection.connect((err) => {
    if (err) {
        console.error('error connecting:'+ err.message);
        process.exit(1);
    };
    console.log(`Database status : ${connection.state}`.magenta);
});

module.exports = connection;