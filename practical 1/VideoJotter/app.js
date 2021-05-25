// Bring in the packages required for this application
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

// Load routes
const mainRoute = require('./routes/main');

// creates an express server
const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
	defaultLayout: 'main'				// Specify default template views/layout/main.handlebar
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

// Global variables
app.use(function(req, res, next){
	next();
});

// Use Routes
app.use('/', mainRoute);	// uses main.js routing under ./routes

const port = 5000;


app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});