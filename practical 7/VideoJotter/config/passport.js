const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/User');


function localStrategy(passport){
	passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
		// Match user
		User.findOne({
				where: {email: email}
			})
			.then(user => {
				if(!user) {
					return done(null, false, {message: 'No User Found'});
				}			
				// Match password
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if(err) throw err;
					if(isMatch) {
						return done(null, user);
					} else {
						return done(null, false, {message: 'Password Incorrect'});
					}
				})
			})
	}));
	
	// Serializes (stores) user id into session store upon successful authentication
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	
	// User object is retrieved by userId from session store and put into req.user
	passport.deserializeUser((userId, done) => {
		User.findByPk(userId)
			.then((user) => {
				done(null, user); // user object saved in req.session
			})
			.catch((done) => { // No user found, not stored in req.session
				console.log(done);
			});
	});
}

module.exports = {localStrategy};