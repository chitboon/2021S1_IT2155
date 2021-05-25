const moment = require('moment');

module.exports =  {
	formatDate: function(date, targetFormat){
		return moment(date).format(targetFormat);
	}
} ;