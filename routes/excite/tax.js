/* eslint-disable prettier/prettier */
const express = require('express');
const router = express.Router();
const Controller = require('../../controller/excite/tax')

router.get('/get-all-tax', Controller.getAllTax);
router.get('/get-all-tax/firs', Controller.getAllFIRS);
router.get('/get-all-tax/lirs', Controller.getAllLIRS);

router.post('/assign-tax/partner', Controller.assignTaxToParnter);

module.exports = router

