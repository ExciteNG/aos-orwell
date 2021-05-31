const express = require('express');
const router = express.Router();
const Controller = require('../../controller/partners/partners');
const LoanController = require('./../../controller/partners/loans/loan')
const {requireJWT} = require('./../../middleware/auth')





// 
router.get('/profile/myprofile',requireJWT, Controller.myProfile);
router.put('/profile/myprofile/bank/update',requireJWT, Controller.myBankUpdate);

router.get('/tax/get-all-applicants',requireJWT,Controller.getTaxApplicants)

router.get('/business/check-names/get-all-applicants',requireJWT,Controller.getCheckNameApplicants)

router.get('/business/business-names-reg/get-all-applicants',requireJWT,Controller.getBusinessNameApplicants)

// Approved name reservation
router.put('/business/check-names-reg/approve-applicants',requireJWT,Controller.approvedReservation)



// Loan
router.get('/loan/channelle/new-account/get-all-applicants', LoanController.getAccountAppChannelle);
router.get('/loan/channelle/new-account/get-applicantion/:application', LoanController.getApplicationInfo);


module.exports = router
