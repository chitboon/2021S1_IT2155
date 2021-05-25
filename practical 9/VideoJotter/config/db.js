if(process.env.NODE_ENV === 'production'){
	module.exports = require('./dbProd');
} else {
	module.exports = require('./dbDev');
}     