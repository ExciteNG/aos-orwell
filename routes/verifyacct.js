/* eslint-disable prettier/prettier */
const router = require('express').Router();
//const User = require('../models/User');
const {requireJWT} = require('../middleware/auth');
var nodeoutlook = require('nodejs-nodemailer-outlook');
const Users = require('../models/User');
const verifyEmail = require("../emails/verify_template");
const crypto = require('crypto');

router.post('/verify-account', async (req,res) => {
    //filter users who haven't their emails
    try {
        const {email} = req.user;
        const User = await Users.findOne({email:email}).lean()
        if (!User) return res.json({code:400,message:"an error occurred !, try again"})
    
        //send mail
        nodeoutlook.sendEmail({
            auth: {
              user: process.env.EXCITE_ENQUIRY_USER,
              pass: process.env.EXCITE_ENQUIRY_PASS,
            },
            from: "enquiry@exciteafrica.com",
            to: User.email,
            subject: "Verify Your Account",
            html: verifyEmail(User.username, User.email, User.verifyToken),
            text: verifyEmail(User.username, User.email, User.verifyToken),
            replyTo: "enquiry@exciteafrica.com",
            onError: (e) => console.error(e),
            onSuccess: (i) => console.log(i),
            secure: false,
          });
          return res.json({code:200,message:"a verification mail has been sent to proceed with the next steps"})
    } catch(err){
        console.error(err)
        return res.json({code:400,message:err.message})
    }

})

module.exports = router;