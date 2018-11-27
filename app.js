const express               = require('express'),
      app                   = express(),
      mongoose              = require('mongoose'),
      flash                 = require('connect-flash'),
      passport              = require('passport'),
      bodyParser            = require('body-parser'),
      LocalStrategy         = require('passport-local'),
      methodOverride        = require('method-override')
      PassportLocalMongoose = require('passport-local-mongoose'),
      Campground            = require('./models/campground'),
      Comment               = require('./models/comment'),
      User                  = require('./models/user'),
      seedDB                = require('./seed');

const commentRoutes         = require('./routes/comments'),
      campgroundRoutes      = require('./routes/campgrounds'),
      indexRoutes            = require('./routes/index')


// mongoose.connect(process.env.DATABASEURL)
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true })
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use(flash())
// seedDB();

//moment.js
app.locals.moment = require('moment')

// Passport Configuration
app.use(require('express-session')({
  secret: 'The crow sang Peggy Lee love ballads to the dolphin',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next();
})

app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

app.listen(process.env.PORT || 3000, function() {
  console.log('processing....')
})
