const alertMessage = require('./messenger');

const ensureAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()) {
		return next();
	}
	alertMessage(res, 'danger', 'Access Denied', 'fas fa-exclamation-circle', true);
	res.redirect('/');
};

module.exports = ensureAuthenticated;