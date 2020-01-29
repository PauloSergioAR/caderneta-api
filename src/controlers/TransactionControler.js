const Transaction = require("../models/Transaction")
const User = require("../models/User")

async function index(req, res){  
  const { email } = req.params  

  await User.findOne({email}, async (err, doc) => {
    if(err){
      return res.json({message: err})
    } else if(!doc) {
      return res.json({message: "User not found"})
    } else {
      let user = doc.toJSON()
      let id = user._id

      let transactions_pay_promise = await Transaction.find({ "payer": id }).populate('receiver').exec()
      let transactions_receive_promise = await Transaction.find({ "receiver": id }).populate('payer').exec()

      Promise.all([transactions_pay_promise, transactions_receive_promise]).then(docs => {
        let return_obj = {
          to_pay: docs[0],
          to_receive: docs[1]
        }

        return res.json(return_obj)
      })            
    }
  })  
}

async function store(req, res){  
  let { name_payer, name_receiver, email_payer, email_receiver, value, dueDate } = req.body

  let payer
  let receiver

  let error

  dueDate = dueDate.map((date) => new Date(date))
  value = parseFloat(value)

  let payer_promise = name_payer ? name_payer : User.findOne({"email": email_payer}).exec()
  let receiver_promise = name_receiver ? name_receiver : User.findOne({ "email": email_receiver }).exec()

  if(payer_promise instanceof Promise && receiver_promise instanceof Promise){
    Promise.all([payer_promise, receiver_promise]).then(docs => {
      payer = docs[0]._id
      receiver = docs[1]._id
  
      let transaction = Transaction.create({
        value: value,
        dueDate: dueDate,
        payer: payer._id,
        receiver: receiver._id
      })
    
      return res.json(transaction)
    })
  } else {
    let payer = await payer_promise
    let receiver = await receiver_promise

    payer = payer._id ? payer._id : payer
    receiver = receiver._id ? receiver._id : receiver

    let transaction = Transaction.create({
      value: value,
      dueDate: dueDate,
      payer: payer,
      receiver: receiver
    })

    Transaction.findOne({"payer": payer}).populate('payer').exec((err, doc) => {
      return res.json(doc)
    })
  
    
  }
}

module.exports = {
  index,
  store
}