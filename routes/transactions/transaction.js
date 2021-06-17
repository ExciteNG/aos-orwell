const {requireJWT} = require('../../middleware/auth')
const express = require('express');

const router = express.Router();

const TransactionCtrl = require('../../controller/transactions/transaction');

// create transaction
router.post('/new', requireJWT, TransactionCtrl.createTransaction);

// update a transaction
router.put('/update/:id', requireJWT, TransactionCtrl.updateTransaction);

// delete one transaction
router.delete('/:id', requireJWT, TransactionCtrl.deleteTransaction);

// get one transaction by id
router.get('/:id', requireJWT, TransactionCtrl.getOneTransaction);

// get all transactions
router.get('/', requireJWT, TransactionCtrl.getAllTransactions);

module.exports = router;
