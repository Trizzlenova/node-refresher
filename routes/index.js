const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const middleware = require('../middleware')

router.get("/", function(req, res){
    res.render("landing");
});

router.get('/register', function(req, res) {
  res.render('register', {page: 'register'})
})

router.post('/register', function(req, res) {
  req.body.username
  req.body.password
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if(err){
      req.flash('error', err.message)
      return res.render('register', {error: err.message})
    }
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Welcome ' + req.body.username)
      res.redirect('/campgrounds')
    })
  })
})

// Login Routes
router.get('/login', function(req, res) {
  res.render('login', {page: 'login'})
})

// middleware
router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
  }), function(req, res) {
})

router.get('/logout', function(req, res) {
  req.logout()
  req.flash('success', 'Logged out!')
  res.redirect('/campgrounds')
})


module.exports = router;
