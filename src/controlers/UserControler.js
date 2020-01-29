const User = require('../models/User')

module.exports = {
  async index(req, res){
    console.log("Index route reached")
    let data = await User.find()
    return res.json(data)
  },
  
  async show(req, res){
    console.log("Show route reached")    
    const { email } = req.params    
    await User.findOne({"email": email}, (err, doc) =>{
      if(err){
        return res.json({message: err})
      } else if(!doc){
        return res.json({message: "User not found"})
      } else {
        return res.json(doc)
      }      
    })    
  },
  
  async store(req, res){
    console.log("Store route reached")
    const { email, name, avatar_url } = req.body
  
    let user = await User.findOne({ email })
  
    if(!user){
      user = await User.create({
        email,
        name,
        avatar_url
      })
    }
  
    return res.json(user)
  },
  
  async update(req, res){
    console.log("Update route reached")
    const {email, new_email, name, avatar_url} = req.body
  
    let user
  
    if(new_email){
      user = await User.findOne({new_email})
    }
      
    if(!user){
      let updateObject = {
        ...new_email && {email: new_email},
        ...name && {name: name},
        ...avatar_url && {avatar_url: avatar_url}
      }
  
      await User.findOneAndUpdate({email}, updateObject)
  
      let updatedUser
  
      if(new_email){
        updatedUser = await User.findOne({new_email})
      } else {
        updatedUser = await User.findOne({email})
      }
      
      return res.json(updatedUser)
    }
  
    return res.json({message: "That email is already in use"})
  }
}
