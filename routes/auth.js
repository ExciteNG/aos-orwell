const express = require('express')
const {
  signUp,
  signUpAffiliates,
  signUpPartner,
  signUpClientEmployees,
  signIn,
  requireJWT,
  signJWTForUser,
  signJWTForAffiliates,
  signJWTForPartners,
  signJWTForSpringBoard,
  authPageMerchant,
  authPageAffiliate,
  authPagePartner,
  authPageSpringBoard
} = require('../middleware/auth')

const router = express.Router()

// Sign up merchants
router.post('/auth/sign-up', signUp)
// router.post('/auth/sign-up', signUp, signJWTForUser)


// Sign up affiliates
router.post('/auth/affiliate/sign-up', signUpAffiliates)


// Sign up partner
router.post('/auth/partner/sign-up', signUpPartner)



// Sign in client
router.post('/auth', signIn, signJWTForUser)
// Sign in affiliates
router.post('/auth/login/affiliates', signIn, signJWTForAffiliates)
// Sign in partners
router.post('/auth/login/partners', signIn, signJWTForPartners)
// Sign in springboard
router.post('/auth/login/springboard', signIn, signJWTForSpringBoard)


//page authorization

router.get('/verification/verify/ex10af',requireJWT,authPageMerchant)
router.get('/verification/verify/ex20af',requireJWT,authPageAffiliate)
router.get('/verification/verify/ex50af',requireJWT,authPagePartner)
router.get('/verification/verify/exsbaf',requireJWT,authPageSpringBoard)

module.exports = router
