var createError = require('http-errors');
var express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');
var exphbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
var useragent = require('express-useragent');
const mongoose = require('mongoose');
require('dotenv').config();


var apiRouter = require('./routes/api');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const {
  genuid,
} = require('./helper/hbs');

app.engine('handlebars', exphbs.engine({
  helpers: {
      genuid,
  },
  extname: '.hbs', defaultLayout: "home",
  partialsDir: __dirname + '/views/partials/'
}));
app.use(flash());

mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(process.env.MONGO_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
}).then(() => {
        console.log('MongoDB Connected');
}).catch(err => console.log(err));

var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore({
    uri: process.env.MONGO_CONNECT,
    collection: 'session'
});

app.set('trust proxy', 1);

app.use(session({

    secret: 'petfish',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 30
    },
    genid: function(req) {
        return genuid() // use UUIDs for session IDs
    },
    store: store
}));


app.use('/graphql', graphqlHTTP({
  //directing express-graphql to use this schema to map out the graph 
  schema,
  //directing express-graphql to use graphiql when goto '/graphql' address in the browser
  //which provides an interface to make GraphQl queries
  graphiql:true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(cookieParser());

app.set('trust proxy', 1);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.render('error', {
      status: err.status || 500,
      error: err,
      url: req.url
  });
});




global.__basedir = __dirname;
global.__basedir__file = process.env.BASE_DIR_FILE;

module.exports = app;


















