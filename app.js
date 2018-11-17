const express               = require('express'),
      app                   = express(),
      mongoose              = require('mongoose'),
      passport              = require('passport'),
      bodyParser            = require('body-parser'),
      LocalStrategy         = require('passport-local'),
      PassportLocalMongoose = require('passport-local-mongoose'),
      Campground            = require('./models/campground'),
      Comment               = require('./models/comment'),
      User                  = require('./models/user')
      seedDB                = require('./seed')

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true })
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'))
seedDB();

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

app.get("/", function(req, res){
    res.render("landing");
});

app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render('campgrounds/index',{campgrounds:allCampgrounds});
       }
    });
});

app.post('/campgrounds', function(req, res){
  let name = req.body.name
  let image = req.body.image
  let desc = req.body.desc
  let newCampground = {name: name, image: image, description: desc}
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){console.log(err)}
    else {
      res.redirect('campgrounds')
    }
  })
})

app.get('/campgrounds/new', function(req, res) {
  res.render('campgrounds/new')
})

app.get('/campgrounds/:id', function(req, res) {
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err){console.log(err)}
    else {
      console.log(foundCampground)
      res.render('campgrounds/show', {campground:foundCampground})
    }
  })
})

// COMMENT ROUTES

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if(err){console.log(err)}
    else {
    res.render('comments/new', {campground: campground})
    }
  })
})

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if(err){
      console.log(err)
      res.redirect('/campgrounds')
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if(err){console.log(err)}
        else {
          campground.comments.push(comment)
          campground.save()
          res.redirect('/campgrounds/' + campground._id)
        }
      })
    }
  })
})

// Auth Routes

app.get('/register', function(req, res) {
  res.render('register')
})

app.post('/register', function(req, res) {
  req.body.username
  req.body.password
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if(err){
      console.log(err)
      return res.render('register')
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/campgrounds')
    })
  })
})

// Login Routes
app.get('/login', function(req, res) {
  res.render('login')
})

// middleware
app.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
  }), function(req, res) {
})

app.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/campgrounds')
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}


app.listen(process.env.PORT || 3000, function() {
  console.log('processing yelpcamp')
})
