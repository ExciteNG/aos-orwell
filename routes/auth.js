/* eslint-disable spaced-comment */
const express = require('express')
const {
  signUp,
  signUpAffiliates,
  signUpPartner,
  setUpSpringBoard,
  signIn,
  requireJWT,
  signJWTForUser,
  signJWTForAffiliates,
  signJWTForPartners,
  signJWTForSpringBoard,
  authPageMerchant,
  authPageAffiliate,
  authPagePartner,
  authPageSpringBoard,
  signUpRefCode,
  setUpAdmin,
  signJWTForExcite
} = require('../middleware/auth')

const router = express.Router()

// Sign up merchants
router.post('/auth/sign-up', signUp)
// router.post('/auth/sign-up', signUp, signJWTForUser)


// Sign up affiliates
router.post('/auth/affiliate/sign-up', signUpAffiliates)

//verify signup via token
// router.post('/auth/affiliate/sign-up/:token', verifyAffiliateToken)

// Sign up affiliates (referrals)
router.post('/auth/affiliate/sign-up/ref-system/', signUpRefCode)
//verify sign up affiliates via token
// router.post('/auth/affiliate/sign-up/ref-system/:token', verifyAffiliateToken)


// Sign up partner
router.post('/auth/partner/sign-up', signUpPartner)

// Sign up springboard
router.post('/auth/springboard/set-up', setUpSpringBoard)

// Setup admin
router.post('/auth/management/set-up', setUpAdmin)



// Sign in client
router.post('/auth', signIn, signJWTForUser)
// Sign in affiliates
router.post('/auth/login/affiliates', signIn, signJWTForAffiliates)
// Sign in partners
router.post('/auth/login/partners', signIn, signJWTForPartners)
// Sign in springboard
router.post('/auth/login/springboard', signIn, signJWTForSpringBoard)
//sign in admin
router.post('/auth/login/admin', signIn, signJWTForExcite)


//page authorization

router.get('/verification/verify/ex10af',requireJWT,authPageMerchant)
router.get('/verification/verify/ex20af',requireJWT,authPageAffiliate)
router.get('/verification/verify/ex50af',requireJWT,authPagePartner)
router.get('/verification/verify/exsbaf',requireJWT,authPageSpringBoard)

module.exports = router
