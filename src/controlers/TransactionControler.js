const Transaction = require("../models/Transaction")
const User = require("../models/User")

module.exports = {
  async index(req, res) {
    console.log("Reached Transaction index route with tag: ")
    const { tag } = req.params
    console.log("Reached Transaction index route with tag: " + tag)

    await User.findOne({ tag }, async (err, doc) => {
      if (err) {
        return res.json({ message: err })
      } else if (!doc) {
        return res.json({ message: "User not found" })
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
  },

  async storeTransactionForSingleAccount(req, res) {
    let { name, tag_payer, tag_receiver, value, dueDate } = req.body

    let store_object

    let payer
    let receiver

    if(tag_payer && !tag_receiver){
      payer = await User.findOne({tag: tag_payer})
      
      store_object = {
        value,
        dueDate,
        payer: payer.id,
        receiver_name: name
      }
    } else if(tag_receiver && !tag_payer){
      receiver = await User.findOne({tag: tag_receiver})

      store_object = {
        value,
        dueDate,
        receiver: receiver.id,
        payer_name: name
      }
    } else {
      return res.json({error: { message: "Malformed request"}})
    }

    Transaction.create(store_object).then(() => {
      let query = payer ? {payer} : {receiver}
      let populate = payer ? 'payer' : 'receiver'

      Transaction.findOne(query).populate(populate).exec((err, doc) => {
        if (err) {
          return res.json(err)
        }
        return res.json(doc)
      })
    })
  },

  async storeTransactionForBothAccounts(req, res) {
    let { tag_payer, tag_receiver, value, dueDate } = req.body

    let payer
    let receiver

    dueDate = dueDate.map((date) => new Date(date))
    value = parseFloat(value)

    let payer_promise = User.findOne({ "tag": tag_payer }).exec()
    let receiver_promise = User.findOne({ "tag": tag_receiver }).exec()

    Promise.all([payer_promise, receiver_promise]).then(docs => {
      if(!docs[0] || !docs[1]){
        let missing = !docs[0] ? tag_payer : tag_receiver
        return res.json({error: {message: "Cannot find " + missing}})
      }

      payer = docs[0]._id
      receiver = docs[1]._id

      new Transaction({
        value: value,
        dueDate: dueDate,
        payer: payer._id,
        receiver: receiver._id
      }).save((err, doc) => {
        if(err){
          return res.json(err)
        }
        return res.json(doc)
      })
      return res.json(transaction)
    })
  }
}
