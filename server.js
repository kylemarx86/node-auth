const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

var configDB = require('./config/database.js');
const configSess = require('./config/session.json');

// configuration
var options = {
    useMongoClient: true
};
mongoose.connect(configDB.url, options);
require('./config/passport')(passport);  // pass passport for configuration

// set up express app
var app = express();
var port = process.env.PORT || 3000;

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser());    // read cookies (needed for auth)
app.use(bodyParser());  // get information from html forms

app.set('view engine', 'ejs');  // set up ejs for templating

// required for passport

app.use(session({secret: configSess.secret}));  // session secret
app.use(passport.initialize());
app.use(passport.session());    // persistent login sessions
app.use(flash());   // use connect-flash for flash messages stored in session

// routes
require('./app/routes.js')(app, passport);  // load our routes and pass in our app and fully configured passport


// launch
app.listen(port);
console.log(`server running on port ${port}`);