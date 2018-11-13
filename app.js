const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      Campground = require('./models/campground'),
      Comment    = require('./models/comment'),
      seedDB     = require('./seed')

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true })
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
seedDB();

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("index",{campgrounds:allCampgrounds});
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
      res.redirect('/campgrounds')
    }
  })
})

app.get('/campgrounds/new', function(req, res) {
  res.render('new.ejs')
})

app.get('/campgrounds/:id', function(req, res) {
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err){console.log(err)}
    else {
      console.log(foundCampground)
      res.render('show', {campground:foundCampground})
    }
  })
})

app.listen(process.env.PORT || 3000, function() {
  console.log('processing yelpcamp')
})
