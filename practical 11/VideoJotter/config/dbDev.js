require('env2')('.env');

module.exports = {
	host: process.env.DEV_DB_HOST,
	database: process.env.DEV_DB_NAME,
	username: process.env.DEV_DB_USER,
	password: process.env.DEV_DB_PASS
}