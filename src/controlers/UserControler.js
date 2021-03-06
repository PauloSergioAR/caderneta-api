const User = require('../models/User')

module.exports = {
  async index(req, res){
    console.log("Index route reached")
    let data = await User.find()
    return res.json(data)
  },
  
  async getUserById(req, res){
    const { tag } = req.params 
    await User.findOne({"tag": tag}, (err, doc) =>{
      if(err){
        return res.json({message: err})
      } else if(!doc){
        return res.json({message: "User not found"})
      } else {
        return res.json(doc)
      }      
    })    
  },

  async getUserByFid(req, res){
    const { id } = req.params 
    await User.findOne({"facebook_id": id}, (err, doc) =>{
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
    const { facebook_id, tag, name, avatar_url } = req.body
    console.log(facebook_id)
  
    let user = await User.findOne({ tag })
  
    if(!user){
      user = await User.create({
        facebook_id,
        tag,
        name,
        avatar_url
      })
    }
    console.log(user)
    return res.json(user)
  },
  
  async update(req, res){
    console.log("Update route reached")
    const {tag, name, avatar_url} = req.body
  
    let user
      
    if(!user){
      let updateObject = {        
        ...name && {name: name},
        ...avatar_url && {avatar_url: avatar_url}
      }
  
      await User.findOneAndUpdate({tag}, updateObject)
  
      let updatedUser
  
      updatedUser = await User.findOne({tag})
          
      return res.json(updatedUser)
    }
  }
}
