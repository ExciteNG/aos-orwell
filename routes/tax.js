const {requireJWT} = require('../middleware/auth')
const express = require('express');

const router = express.Router();

const taxCtrl = require('../controller/tax');


// Tax ROUTES
// post taxs
router.post('/tax/new', taxCtrl.createTax);

// update a tax
router.put('/tax/:id', taxCtrl.updateTax);

// delete one tax
router.delete('/tax/:id', taxCtrl.deleteTax);

// get one tax by id
router.get('/tax/:id', taxCtrl.getOneTax);

// get all taxes
router.get('/tax', taxCtrl.getAllTax);

module.exports = router;
