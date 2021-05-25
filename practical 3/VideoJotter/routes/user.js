const express = require('express');
const router = express.Router();

// User Register Route URL => /user/register
router.post('/register', (req, res) => {
	let errors = [];

	// Checks if both passwords entered are the same
	if (req.body.password !== req.body.password2) {
		errors.push({
			text: 'Passwords do not match'
		});
	}
	// Checks that password length is more than 4
	if (req.body.password.length < 4) {
		errors.push({
			text: 'Password must be at least 4 characters'
		});
	}
	/*
	 If there is any error with password mismatch or size, then there must be
	 more than one error message in the errors array, hence its length must be more than one.
	 In that case, render register.handlebars with error messages.
	 */
	if (errors.length > 0) {
		res.render('user/register', {
			errors: errors,
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			password2: req.body.password2
		});
	} else {
		let success_msg = `${req.body.email} registered successfully`;
		res.render('user/login', {
			success_msg // or sucess_msg: success_msg
		});
	}
});

module.exports = router;