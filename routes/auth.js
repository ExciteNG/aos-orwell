/* eslint-disable prettier/prettier */
/* eslint-disable spaced-comment */
const express = require('express');

const {
  signUp,
  signUpAffiliates,
  signUpAgents,
  signUpAgentRefCode,
  signUpInfluencers,
  signUpPartner,
  setUpSpringBoard,
  signIn,
  requireJWT,
  signJWTforAgents,
  signJWTForUser,
  signJWTForAffiliates,
  signJWTForInfluencers,
  signJWTForPartners,
  signJWTForSpringBoard,
  signUpRefCode,
  setUpAdmin,
  passwordReset,
  signJWTForExcite,
  signJWTForUserOnMobile
} = require('../middleware/auth')

const router = express.Router()

// Sign up merchants
router.post('/auth/sign-up', signUp)
// router.post('/auth/sign-up', signUp, signJWTForUser)

//sign up influencers
router.post('/auth/influencer-marketer/sign-up', signUpInfluencers)

//sign up agents
router.post('/auth/agent/sign-up',signUpAgents)

//sign up agents referrals 
router.post('/auth/agents/sign-up/ref-system/',signUpAgentRefCode)


// Sign up affiliates
router.post('/auth/affiliate/sign-up', signUpAffiliates)

//verify signup via token
// router.post('/auth/affiliate/sign-up/:token', verifyAffiliateToken)

// Sign up affiliates (referrals)
router.post('/auth/affiliate/sign-up/ref-system/', signUpRefCode)
//verify sign up affiliates via token
// router.post('/auth/affiliate/sign-up/ref-system/:token', verifyAffiliateToken)

// 
// Sign up agents (referrals)
router.post('/auth/agents/sign-up/ref-system/', signUpAgentRefCode)
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
router.post('/auth/mobile', signIn, signJWTForUserOnMobile)
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

//sign in agents 
router.post('/auth/login/agent',signIn,signJWTforAgents)



module.exports = router
