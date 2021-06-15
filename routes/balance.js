const {requireJWT} = require('../middleware/auth')
const express = require('express');

const router = express.Router();

const BalanceCtrl = require('../controller/balance');

// create balance
router.post('/new', requireJWT, BalanceCtrl.createBalance);

// update a balance
router.put('/update/:id', requireJWT, BalanceCtrl.updateBalance);

// delete one balance
router.delete('/:id', requireJWT, BalanceCtrl.deleteBalance);

// get one balance by id
router.get('/:id', requireJWT, BalanceCtrl.getOneBalance);

// get all balances
router.get('/', requireJWT, BalanceCtrl.getAllBalances);

module.exports = router;
