const express = require('express');
const router = express.Router();
const Controller = require('../../controller/partners/partners');
const {requireJWT} = require('./../../middleware/auth')

router.get('/profile/myprofile',requireJWT, Controller.myProfile);
router.put('/profile/myprofile/bank/update',requireJWT, Controller.myBankUpdate);

router.get('/tax/get-all-applicants',requireJWT,Controller.getTaxApplicants)

router.get('/business/check-names/get-all-applicants',requireJWT,Controller.getCheckNameApplicants)

router.get('/business/business-names-reg/get-all-applicants',requireJWT,Controller.getBusinessNameApplicants)

// Approved name reservation
router.put('/business/check-names-reg/approve-applicants',requireJWT,Controller.approvedReservation)


module.exports = router
