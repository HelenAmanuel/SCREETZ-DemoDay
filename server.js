// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT ||8000;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var multer = require('multer');
// const multerConf = {
//   storage : multer.diskStorage({
//     destination: function(req,file,next){
//       next(null,'/public/img');
//     },
//     filename:function (req,file,next){
//       const ext = file.mimtype.split('/')[1];
//       next(null,file.fieldname = '-' + Date.now() + "." + ext);
//     }
//   }),
//   fileFilter:function(req,file,next){
//     if(!file){
//       next();
//     }
//     const img = file.mimetype.startsWith("img/");
//     if(img){
//       next(null,true);
//     }else{
//       next({message:"file type not supported"},false);
//     }
//   }
// };

var configDB = require('./config/database.js');

var db

// configuration ===============================================================
mongoose.connect(configDB.url,{ useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, multer, db, ObjectId);
}); // connect to our database

//app.listen(port, () => {
    // MongoClient.connect(configDB.url, { useNewUrlParser: true }, (error, client) => {
    //     if(error) {
    //         throw error;
    //     }
    //     db = client.db(configDB.dbName);
    //     console.log("Connected to `" + configDB.dbName + "`!");
    //     require('./app/routes.js')(app, passport, db);
    // });
//});

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2019a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
