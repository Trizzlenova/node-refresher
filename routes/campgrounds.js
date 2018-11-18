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

router.post('/', function(req, res){
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

router.get('/new', function(req, res) {
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

module.exports = router;
