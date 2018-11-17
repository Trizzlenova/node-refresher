const mongoose = require('mongoose')
const CampgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})

const Campground = mongoose.model('Campground', CampgroundSchema)

module.exports = Campground
