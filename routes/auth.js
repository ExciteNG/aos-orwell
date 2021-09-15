/* eslint-disable prettier/prettier */
/* eslint-disable spaced-comment */
const express = require('express');

const {
  signUp,
  signIn,
  requireJWT,
  signJWTForUser,
} = require('../middleware/auth')

const router = express.Router()

// Sign up merchants
router.post('/create-account', signUp)
// router.post('/auth/sign-up', signUp, signJWTForUser)


// Sign in client
router.post('/login-account', signIn, signJWTForUser)



module.exports = router
