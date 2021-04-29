const express = require('express');
const router = express.Router();
const CheckName = require('../models/Checkname')
const BusinessReg = require('../models/businessreg')
const Users = require('./../models/User');


router.post('/confirmation/email', async (req, res) => {

// console.log(req.body)
  const user = req.body.user;
  const data = user.split('_');
  const [email,token] = data;
  const account = await Users.findOne({email:email})
  const acctToken = account.verifyToken;
  if(acctToken===token) {
    await Users.findOneAndUpdate({email:email},{emailVerified:true})
    // await account.save()
    return res.json({code:201,message:"account confirm",email:email}
  )}else{
    res.json({code:400,message:"Invalid"})
  }
});



module.exports = router
