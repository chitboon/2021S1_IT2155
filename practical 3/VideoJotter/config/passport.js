const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/User');


function localStrategy(passport){
	passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
		console.log(`######### Passport email: ${email}`);
		// Match user
		User.findOne({
				where: {email: email}
			})
			.then(user => {
				console.log('######### User email found');
				if(!user) {
					return done(null, false, {message: 'No User Found'});
				}
			
				// Match password
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if(err) throw err;
					if(isMatch) {
						console.log('######### Password match');
						return done(null, user);
					} else {
						return done(null, false, {message: 'Password Incorrect'});
					}
				})
			})
	}));
	
	passport.serializeUser((user, done) => {
		/*console.log('\nFrom serializeUser-------------');
		console.log(user);*/
		done(null, user.id);
	});
	
	passport.deserializeUser((id, done) => {
		User.findByPk(id)
			.then((user) => {
				/*onsole.log('\nFound user from deserializeUser-------------');
				console.log(user);*/
				done(null, user);
			})
			.catch((done) => {
				console.log(done);
			});
	});
}

module.exports = {localStrategy};