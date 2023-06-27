const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
	host: process.env.DB_HOST, // IP del servidor de la base de datos
	user: process.env.DB_USER, // usuario de la base de datos
	password: process.env.DB_PASSWORD, // contraseña de la base de datos
	database: process.env.DB_NAME, // nombre de la base de datos
	charset: process.env.DB_CHARSET, // conjunto de caracteres del servidor
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
