const mongoose  = require("./mongoose"),
      Camground = require('./models/campground'),
      Comment   = require('./models/comment')

let data = [
  {
    name: 'Clouds Rest',
    image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
    description: 'The cloud rests on the flicker of the nights only star'
  },
  {
    name: 'Desert Mesa',
    image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
    description: 'The pain of the heat from the desert sun makes the cactus cry'
  },
  {
    name: 'Canyon Floor',
    image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
    description: 'Who is it that waits at the center of the bottomless canyon?'
  },
]

function seedDB() {
  // remove campgrounds
  Campground.remove({}, function(err) {
    if(err){console.log(err)}
    console.log('removed campgrounds')
    // remove comments
    Comment.remove({}, function(err) {
      if(err){console.log(err)}
      console.log('removed comments')
      // seed the data
      data.forEach(function(seed) {
        Campground.create(seed, function(err, campground) {
          if(err){console.log(err)}
          else {
            console.log('added campground')
            // add a comment
            Comment.create({
              text: 'Whoa...deep.',
              author: 'Bent Twig'
            }, function(err, comment) {
              if(err){console.log(err)}
              else {
                comment.campgrounds.push(comment)
                campground.save()
                console.log('created comment')
              }
            })
          }
        })
      })
    })
  })
}

module.exports = seedDB
