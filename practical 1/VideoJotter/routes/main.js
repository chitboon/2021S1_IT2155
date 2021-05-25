const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
	const title = 'Video Jotter';
	res.render('index', {			// renders views/index.handlebars
		title
	})
});


router.get('/about', (req, res) => {
	const author = 'Robert Lim';
	let values = [19, 23, 40, 25, 2, 7];
	res.render('about', {			// renders views/about.handlebars, passing author as variable
		author: author,
		values
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


module.exports = router;
