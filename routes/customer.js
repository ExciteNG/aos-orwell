const {requireJWT} = require('../middleware/auth')
const express = require('express');

const router = express.Router();

const CustomerCtrl = require('../controller/customer');

// create customer
router.post('/new', requireJWT, CustomerCtrl.createCustomer);

// update a customer
router.put('/update/:id', requireJWT, CustomerCtrl.updateCustomer);

// delete one customer
router.delete('/:id', requireJWT, CustomerCtrl.deleteCustomer);

// get one customer by id
router.get('/:id', requireJWT, CustomerCtrl.getOneCustomer);

// get all customers
router.get('/', requireJWT, CustomerCtrl.getAllCustomers);

module.exports = router;
