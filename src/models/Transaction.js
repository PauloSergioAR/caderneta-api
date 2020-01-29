const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
  value: Number,  
  dueDate: [Date],
  payer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Transaction', TransactionSchema)