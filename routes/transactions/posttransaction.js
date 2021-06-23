const {requireJWT} = require('../../middleware/auth')
const express = require('express');

const router = express.Router();

const PostTransactionCtrl = require('../../controller/transactions/postTransaction');

// create transaction
router.post('/new', requireJWT, PostTransactionCtrl.createPostTransaction);

// update a transaction
router.put('/update/:id', requireJWT, PostTransactionCtrl.updatePostTransaction);

// delete one transaction
router.delete('/:id', requireJWT, PostTransactionCtrl.deletePostTransaction);

// get one transaction by id
router.get('/:id', requireJWT, PostTransactionCtrl.getOnePostTransaction);

// get all transactions
router.get('/', requireJWT, PostTransactionCtrl.getAllPostTransactions);

module.exports = router;
