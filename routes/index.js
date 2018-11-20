const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const middleware = require('../middleware')

router.get("/", function(req, res){
    res.render("landing");
});

router.get('/register', function(req, res) {
  res.render('register')
})

router.post('/register', function(req, res) {
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
router.get('/login', function(req, res) {
  res.render('login')
})

// middleware
router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
  }), function(req, res) {
})

router.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/campgrounds')
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
