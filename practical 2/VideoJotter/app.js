
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');

// Load routes
const mainRoute = require('./routes/main');
const userRoute = require('./routes/user');

// Messaging libraries
const flash = require('connect-flash');
const FlashMessenger = require('flash-messenger');

// creates an express server
const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
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

// Express session middleware
app.use(session({
	key: 'vidjot_session',
	secret: 'tojiv',
	resave: false,
	saveUninitialized: false,
}));


// Two flash messenging libraries - Flash (connect-flash) and Flash Messenger
app.use(flash());
app.use(FlashMessenger.middleware);


// Global variables
app.use(function(req, res, next){
	next();
});

// Use Routes
app.use('/', mainRoute);	// uses main.js routing under ./routes
app.use('/user', userRoute);

const port = 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});


