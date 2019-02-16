var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose=require('mongoose');
let shopRoutes = require('./routes/shop');
let adminRoutes = require('./routes/admin');
let authRoutes = require('./routes/auth');
const MONGODB_URI = 'mongodb+srv://admin:admin@project-rbfg0.mongodb.net/shop_book';
var app = express();
const session=require('express-session');
const MongoDBStore=require('connect-mongodb-session')(session);
const store=new MongoDBStore({
  uri:MONGODB_URI,
  collection:'Session'
  
});

const User=require('./models/user');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

  app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store:store
}));

// app.use((req, res, next) => {
//   if(!req.session.user){
//       return next();
//   }
//   User.findById(req.session.user._id)
//       .then(user => {
//           req.user = user;
//           next();
//       })
//       .catch(err => console.log(err))
// });

app.use(shopRoutes);
app.use(adminRoutes);
app.use(authRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
const port = process.env.PORT || 5000;


mongoose
  .connect(MONGODB_URI)
  .then(result=>{
    app.listen(port, () =>{
      console.log(`Server started on port ${port}`);
    });
  })
  .catch(err=>console.log(err));
