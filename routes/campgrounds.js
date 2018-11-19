const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')

router.get('/', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render('campgrounds/index',{campgrounds:allCampgrounds});
       }
    });
});

router.post('/', isLoggedIn, function(req, res){
  let name = req.body.name
  let image = req.body.image
  let desc = req.body.description
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  let newCampground = {name: name, image: image, description: desc, author: author}
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){console.log(err)}
    else {
      res.redirect('campgrounds')
    }
  })
})

router.get('/new', isLoggedIn, function(req, res) {
  res.render('campgrounds/new')
})

router.get('/:id', function(req, res) {
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err){console.log(err)}
    else {
      console.log(foundCampground)
      res.render('campgrounds/show', {campground:foundCampground})
    }
  })
})

// Edit
router.get('/:id/edit', function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err){console.log(err)}
    else {
      res.render('campgrounds/edit', {campground:foundCampground})
    }
  })
})

// Update
router.put('/:id', function(req, res) {
  Campground.findOneAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if(err) {
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})


// Destroy
router.delete('/:id', function(req, res) {
  Campground.findOneAndDelete(req.params.id, function(err) {
    if(err) {
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds')
    }
  })
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

module.exports = router;
