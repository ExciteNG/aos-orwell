/* eslint-disable prettier/prettier */
/* eslint-disable spaced-comment */
const express = require('express');

const {
  signUp,
  signUpAffiliates,
  signUpInfluencers,
  signUpPartner,
  setUpSpringBoard,
  signIn,
  requireJWT,
  signJWTForUser,
  signJWTForAffiliates,
  signJWTForInfluencers,
  signJWTForPartners,
  signJWTForSpringBoard,
  authPageMerchant,
  authPageAffiliate,
  authInfluencerMarketer,
  authPagePartner,
  authPageSpringBoard,
  signUpRefCode,
  setUpAdmin,
  passwordReset,
  signJWTForExcite
} = require('../middleware/auth')

const router = express.Router()

// Sign up merchants
router.post('/auth/sign-up', signUp)
// router.post('/auth/sign-up', signUp, signJWTForUser)

//sign up influencers
router.post('/auth/influencer-marketer/sign-up', signUpInfluencers)


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
router.post('/reset-password',passwordReset)



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

//sign in influencer
router.post('/auth/login/influencer', signIn, signJWTForInfluencers)


//page authorization

router.get('/verification/verify/ex10af',requireJWT,authPageMerchant)
router.get('/verification/verify/ex20af',requireJWT,authPageAffiliate)
router.get('/verification/verify/ex50af',requireJWT,authPagePartner)
router.get('/verification/verify/exsbaf',requireJWT,authPageSpringBoard)
//influencer marketer dashboard authorization
router.get('/verification/verify/ex90if',requireJWT,authInfluencerMarketer)
module.exports = router
