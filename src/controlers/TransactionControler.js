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

    let payer = tag_payer ? Transaction.findOne(tag_payer) : name
    let receiver = tag_receiver ? Transaction.findOne(tag_receiver) : name

    Transaction.create({
      value: value,
      dueDate: dueDate,
      payer: payer,
      receiver: receiver
    }).then(() => {
      Transaction.findOne({ "payer": payer }).populate('payer').exec((err, doc) => {
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
  }
}
