require('env2')('.env');

module.exports = {
	host: process.env.PROD_DB_HOST,
	database: process.env.PROD_DB_NAME,
	username: process.env.PROD_DB_USER,
	password: process.env.PROD_DB_PASS
};