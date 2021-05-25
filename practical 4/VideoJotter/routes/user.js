const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Flash Messegner
const alertMessage = require('../helpers/messenger');

// Login Form POST => /user/login
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/video/listVideos',           // Route to /video/listVideos URL
		failureRedirect: '/showLogin',					// Route to /login URL
		failureFlash: true
		/*
		* Setting the failureFlash option to true instructs Passport to flash an error message
		* using the message given by the strategy's verify callback, if any. When a failure occurs
		* passport passes the message object as error object to connect-flash
		* */
	})(req, res, next);
});

// User Register Route URL => /user/register
router.post('/register', (req, res) => {
	let errors = [];

	// Retrieves fields from register page from request body
	let {name, email, password, password2} = req.body;
	
	// Checks if both passwords entered are the same
	if(password !== password2) {
		errors.push({text: 'Passwords do not match'});
	}
	
	// Checks that password length is more than 4
	if(password.length < 4) {
		errors.push({text: 'Password must be at least 4 characters'});
	}
	
	/*
	 If there is any error with password mismatch or size, then there must be
	 more than one error message in the errors array, hence its length must be more than one.
	 In that case, render register.handlebars with error messages.
	 */
	if(errors.length > 0) {
		res.render('user/register', {
			errors,
			name,
			email,
			password,
			password2
		});
	} else {
		// If all is well, checks if user is already registered
		User.findOne({
			where: {email}
		})
		.then(user => {
			if(user) {
				// If user is found, that means email given has already been registered
				//req.flash('error_msg', user.name + ' already registered');
				res.render('user/register', {
					error: user.email + ' already registered',
					name,
					email,
					password,
					password2
				});
			} else {
				// Generate salt hashed password
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(password, salt, (err, hash) => {
						if(err) throw err;
						password = hash;
						// Create new user record
						User.create({
							name,
							email,
							password
						})
						.then(user => {
							alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
							res.redirect('/showLogin');
						})
						.catch(err => console.log(err));
					})
				});
				
			}
		});
	}
});

module.exports = router;