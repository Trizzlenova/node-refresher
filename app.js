const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      Campground = require('./models/campground'),
      Comment    = require('./models/comment')

mongoose.connect('mongodb://localhost/yelp_camp')
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
  Campground.find({}, function(err, allCampgrounds) {
    if(err){console.log(err)}
    else{
      res.render('index', {campgrounds:allCampgrounds})
    }
  })
})

app.get('/campgrounds/new', function(req, res) {
  res.render('new.ejs')
})

app.get('/campgrounds/:id', function(req, res) {
  Campground.FindById(req.params.id, function(err, foundCampground){
    if(err){console.log(err)}
    else {
      res.render('show', {campground:foundCampground})
    }
  })
})

app.post('/campgrounds', function(req, res){
  let name = req.body.name
  let image = req.body.image
  let desc = req.body.desc
  let newCampground = {name: name, image: image, description: desc}
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){console.log(err)}
    else {
      res.redirect('/campgrounds')
    }
  })
})


app.listen(process.env.PORT || 3000, function() {
  console.log('processing yelpcamp')
})
