const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes.js')

const app = express()

mongoose.connect('mongodb+srv://paulosar:rasp123@cluster0-hukua.mongodb.net/test?retryWrites=true&w=majority',
{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to database")).catch((error) => console.log(error))

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(3434)

console.log("Listening on port 3434")

