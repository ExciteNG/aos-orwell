const express = require('express');
const router = express.Router();
const CheckName = require('../../models/Checkname')
const BusinessReg = require('../../models/businessreg')
const Controller = require('../../controller/excite/partners')

//  All partners route
router.get('/all/partners', Controller.getAllPartners);

// Tax partner routes
router.put('/tax/:id', Controller.updatePartner);
router.get('/tax/partners', Controller.getAllTaxPartners);
// Business Partner routes
router.get('/business/partners', Controller.getAllBusinessPartners);

module.exports = router
