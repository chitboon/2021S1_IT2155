const moment = require('moment');

module.exports =  {
	replaceCommas: function(str){
		if (str != null || str.length !== 0){
			if (str.trim().length !== 0) {
				// uses pattern-matching string /,/g for ','
				return str.replace(/,/g, ' | ');
			}
		}
		return 'None';
	},

	formatDate: function(date, targetFormat){
		return moment(date).format(targetFormat);
	},

	radioCheck: function(value, radioValue){
		if (value === radioValue){
			return 'checked';
		}
		return '';
	},
} ;