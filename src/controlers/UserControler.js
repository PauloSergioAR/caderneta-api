const User = require('../models/User')

async function index(req, res){
  let data = await User.find()
  return res.json(data)
}

async function show(req, res){
  const { email } = req.body

  await User.findOne({email: email}, (err, obj) => {
    if(err){
      console.log(err)
      return res.json({error: err})
    } else {
      data = obj.toJSON
      return res.json(obj)
    }
  })
}

async function store(req, res){
  const { email, name, avatar_url }
}