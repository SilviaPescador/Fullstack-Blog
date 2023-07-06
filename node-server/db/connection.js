const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
	host: process.env.DB_HOST, 
	user: process.env.DB_USER, 
	password: process.env.DB_PASSWORD, 
	database: process.env.DB_NAME, 
	charset: process.env.DB_CHARSET, 
});

pool
	.getConnection()
	.then((connection) => {
		console.log("Conexión a la base de datos activa");
		connection.release();
	})
	.catch((error) => {
		console.error("Error de conexión con db: ", error);
	});

module.exports = pool;
