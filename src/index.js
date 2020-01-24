const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes.js')

const app = express()

mongoose.connect('mongodb+srv://paulosar:rasp248123@cluster0-hukua.mongodb.net/caderneta?retryWrites=true&w=majority',
{
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(3434)

