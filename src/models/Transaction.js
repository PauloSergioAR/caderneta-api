const mongoose = require('mongoose')
const User = require('./User')

const TransactionSchema = new mongoose.Schema({
  value: Number,
  installments: Number,
  dueDate: [Date],
  payer: mongoose.Schema.Types.ObjectId,
  receiver: mongoose.Schema.Types.ObjectId
})

module.exports = mongoose.model('Transaction', TransactionSchema)