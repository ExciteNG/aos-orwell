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
          user: "enquiry@exciteafrica.com",
          pass: "ExciteManagement123$"
      },
      from: 'enquiry@exciteafrica.com',
      to: account.email,
      subject: `Welcome ${account.name}`,
      html: WelcomeMail(account.name),
      text:WelcomeMail(account.name),
      replyTo: 'enquiry@exciteafrica.com',
      onError: (e) => console.log(e),
      onSuccess: (i) => console.log(i),
      secure:false
  });
    return res.json({code:201,message:"account confirm",email:email}
  )}else{
    res.json({code:400,message:"Invalid"})
  }
});



module.exports = router
