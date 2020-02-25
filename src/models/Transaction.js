const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
  value: Number,  
  dueDate: [Date],
  payer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  payer_name: String,
  receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  receiver_name: String
})

module.exports = mongoose.model('Transaction', TransactionSchema)