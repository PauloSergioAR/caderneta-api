const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatar_url: String,
})

module.exports = mongoose.model('User', UserSchema)