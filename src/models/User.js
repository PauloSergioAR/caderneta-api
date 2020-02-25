const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  facebook_id: String,
  name: String,
  tag: String,
  avatar_url: String,
})

module.exports = mongoose.model('User', UserSchema)