const express = require('express')
const { requireJWT } = require('../middleware/auth')
const Randomstring = require('randomstring')
const router = express.Router()
const Profiles = require('../models/Profiles')
const {StoreUserSocailInformation} = require('./../social/social')



// Activation
router.get('/app/social-commerce/activate',requireJWT,async (req,res)=>{
const {email,userType} = req.user;

 const token = await StoreUserSocailInformation(email);
 if(!token) return res.status(401)
 return res.json({code:201,token})

})


module.exports = router