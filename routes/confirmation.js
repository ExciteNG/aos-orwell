const express = require('express');
const router = express.Router();
const CheckName = require('../models/Checkname')
const BusinessReg = require('../models/businessreg')
const Users = require('./../models/User');
const nodeoutlook = require('nodejs-nodemailer-outlook')
const WelcomeMail = require("./../emails/new_welcome_templates")

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
    WelcomeMail(account.name)

    nodeoutlook.sendEmail({
      auth: {
          user: process.env.EXCITE_ENQUIRY_USER,
          pass: process.env.EXCITE_ENQUIRY_PASS
      },
      from: process.env.EXCITE_ENQUIRY_USER,
      to: account.email,
      subject: `Welcome ${account.name}`,
      html: WelcomeMail(account.name),
      text:WelcomeMail(account.name),
      replyTo: process.env.EXCITE_ENQUIRY_USER,
      onError: (e) => console.log(e),
      onSuccess: (i) => console.log(i),
      secure:false
  });
    return res.json({code:201,message:"account confirmed",email:email}
  )}else{
    res.json({code:400,message:"Invalid"})
  }
});



module.exports = router
