const mysql = require('mysql2/promise'); // specific module to work with MySQL database

require('dotenv').config(); // use environment variables from separate file for security reasons

['DB_HOST', 'DB_USER', 'DB_NAME', 'DB_PASSWORD'].forEach(connectionParam => {
    if (!process.env[connectionParam]) {
        console.error(`Error: The ${connectionParam} environment variable is not set.`);
        process.exit(1);
    }
}); // check database connection parameters

const databaseConnection = async () => {
    try {
        return mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD
        });
    } catch (error) {
        console.error("Cannot connect to the database:", error);
        throw new Error('Database connection failed');
    }
}; // establishing connection to the local database (once during each request)

module.exports = { databaseConnection }; // // make the above functions accessible from outside