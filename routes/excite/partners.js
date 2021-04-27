const express = require('express');
const router = express.Router();
const CheckName = require('../../models/Checkname')
const BusinessReg = require('../../models/businessreg')
const Controller = require('../../controller/excite/partners')

router.get('/business/partners', Controller.getAllBusinessPartners);
router.get('/tax/partners', Controller.getAllTaxPartners);
router.get('/all/partners', Controller.getAllPartners);


module.exports = router

