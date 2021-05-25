const express = require('express');
const router = express.Router();

const alertMessage = require('../helpers/messenger');

router.get('/', (req, res) => {
	const title = 'Video Jotter';
	res.render('index', {			// renders views/index.handlebars
		title
	})
});


/* 
Exercise 1 solution
*/
/* 
router.get('/about', (req, res) => {
	const author = 'Denzel Washington';
	let errors = [{text:'First error message'}, {text:'Second error message'}, {text:'Third error message'}];
	// Or
	// let errors = []
	// errors.push({text:'First error message'});
	// errors.push({text:'Second error message'});
	// errors.push({text:'Third error message'});

	res.render('about', {			// renders views/about.handlebars, passing author as variable
		author: author,
		errors
	})
}); 
*/
// Exercise 2 solution
router.get('/about', (req, res) => {
	const author = 'Lewis Hamilton';
	
	res.render('about', {	// renders views/about.handlebars, passing author as variable
		author
	})
});

// User Login Route
router.get('/showLogin', (req, res) => {
	res.render('user/login');
});

// shows the register page
router.get('/showRegister', (req, res) => {
	res.render('user/register');		// Activates views/user/register.handlebar
});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	alertMessage(res, 'info', 'Bye-bye!', 'fas fa-power-off', true);
	res.redirect('/');
});

module.exports = router;
