const express = require('express');
const router = express.Router();
const CheckName = require('../../models/Checkname')
const BusinessReg = require('../../models/businessreg')
const Controller = require('../../controller/excite/partners')

//  All partners route
router.get('/all/partners', Controller.getAllPartners);

// excite- partner routes
router.put('/:id', Controller.updatePartner);
router.get('/tax/partners', Controller.getAllTaxPartners);
// Business Partner routes
router.get('/business/partners', Controller.getAllBusinessPartners);

module.exports = router
