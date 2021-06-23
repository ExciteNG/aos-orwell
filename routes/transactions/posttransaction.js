const {requireJWT} = require('../../middleware/auth')
const express = require('express');

const router = express.Router();

const PostTransactionCtrl = require('../../controller/transactions/postTransaction');

// create transaction
router.post('/new', PostTransactionCtrl.createPostTransaction);

// update a transaction
router.put('/update/:id', PostTransactionCtrl.updatePostTransaction);

// delete one transaction
router.delete('/:id', PostTransactionCtrl.deletePostTransaction);

// get one transaction by id
router.get('/:id', PostTransactionCtrl.getOnePostTransaction);

// get all transactions
router.get('/', PostTransactionCtrl.getAllPostTransactions);

module.exports = router;
