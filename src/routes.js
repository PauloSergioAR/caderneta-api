const { Router } = require('express')
const UserControler = require('./controlers/UserControler')
const TransactionControler = require('./controlers/TransactionControler')
const routes = Router()

routes.get('/users/bytag/:tag', UserControler.getUserById)
routes.get('/users/byfid/:id', UserControler.getUserByFid)
routes.get('/users', UserControler.index)
routes.post('/users', UserControler.store)
routes.put('/users', UserControler.update)

routes.get('/transactions/:tag', TransactionControler.index)
routes.post('/transactions/singleaccount', TransactionControler.storeTransactionForSingleAccount)
routes.post('/transactions/bothaccount', TransactionControler.storeTransactionForBothAccounts)

module.exports = routes