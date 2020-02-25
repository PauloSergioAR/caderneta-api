const { Router } = require('express')
const UserControler = require('./controlers/UserControler')
const TransactionControler = require('./controlers/TransactionControler')
const routes = Router()

routes.get('/users/:email', UserControler.show)
routes.get('/users', UserControler.index)
routes.post('/users', UserControler.store)
routes.put('/users', UserControler.update)

routes.get('/transactions/:email', TransactionControler.index)
routes.post('/transactions/singleaccount', TransactionControler.storeTransactionForSingleAccount)
routes.post('/transactions/bothaccount', TransactionControler.storeTransactionForBothAccounts)

module.exports = routes