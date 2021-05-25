
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');

// Load routes
const mainRoute = require('./routes/main');
const userRoute = require('./routes/user');
const videoRoute = require('./routes/video');

// Handlebars Helpers
// Handlebars Helpers
const {formatDate, radioCheck} = require('./helpers/hbs');

// load database libraries
const vidjotDB = require('./config/DBConnection');

// Library to use MySQL to store session objects
const MySQLStore = require('express-mysql-session');
const db = require('./config/db');

// Messaging libraries
const flash = require('connect-flash');
const FlashMessenger = require('flash-messenger');

// creates an express server
const app = express();

// Connects to MySQL database
vidjotDB.setUpDB(false); // Set up database with new tables (true)

// Passport Config
const authenticate = require('./config/passport');
authenticate.localStrategy(passport);

// Handlebars Middleware
app.engine('handlebars', exphbs({
	helpers: {
		formatDate: formatDate,
		radioCheck: radioCheck
	},
	defaultLayout: 'main'						// Specify default template views/layout/main.handlebar 
}));
app.set('view engine', 'handlebars');

// Body parser middleware to parse HTTP body to read post data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(methodOverride('_method'));

// Enables session to be stored using browser's Cookie
app.use(cookieParser());
// Express session midleware
app.use(session({
	key: 'vidjot_session',
	secret: 'tojiv',
	store: new MySQLStore({
		host: db.host,
		port: 3306,
		user: db.username,
		password: db.password,
		database: db.database,
		clearExpired: true,
		// How frequently expired sessions will be cleared; milliseconds:
		checkExpirationInterval: 900000,
		// The maximum age of a valid session; milliseconds:
		expiration: 900000,
	}),
	resave: false,
	saveUninitialized: false,
}));

// Initilize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Two flash messenging libraries - Flash (connect-flash) and Flash Messenger
app.use(flash());
app.use(FlashMessenger.middleware);


// Global variables
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Use Routes
app.use('/', mainRoute);	// uses main.js routing under ./routes
app.use('/user', userRoute);
app.use('/video', videoRoute);

const port = 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});


