/* eslint-disable prettier/prettier */
const express = require('express');
const router = express.Router();
const CheckName = require('../../models/Checkname')
const BusinessReg = require('../../models/businessreg')
const Controller = require('../../controller/excite/business')

router.get('/name-reservation', Controller.getAllNameReservations);
router.get('/name-registration', Controller.getAllBusinessNameRegistrations);
router.post('/assign-name/partner', Controller.assignNameToParnter);
router.post('/assign-businesname-reg/partner', Controller.assignBusinessNameToParnter);

module.exports = router

