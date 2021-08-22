/* eslint-disable no-unused-expressions */
/* eslint-disable prettier/prettier */
const router = require('express').Router();
const async = require('async');
const crypto = require('crypto');
const User = require('../models/User');
const Profile = require('../models/Profiles');
var nodeoutlook = require('nodejs-nodemailer-outlook');
const normalResetPassTemplates = require('../emails/original_password_reset');
const passwordResetConfirmation = require('../emails/password_reset_confirm');


router.post('/forgot-password', async function (req,res,next) {
  console.log(req.body.email)
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        async function(token, done) {
         let userReset = await User.findOne({ email: req.body.email })
            if (!userReset) {
             return res.json({code:500,message:"No account with that email address!"});
              // return res.redirect('/password-forgot/forgot-password');
            }
            userReset.resetPasswordToken = token;
            userReset.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            userReset.save(function(err) {
              if (err) console.error(err)
              // done(err, token, user);
            });
          
          nodeoutlook.sendEmail({
            auth: {
              user: process.env.EXCITE_ENQUIRY_USER,
              pass: process.env.EXCITE_ENQUIRY_PASS,
            },
              from: 'enquiry@exciteafrica.com',
              to: userReset.email,
              subject: 'Excite Account Password Reset',
              html: normalResetPassTemplates(userReset.name.split(' ')[0],userReset.email,token),
              text: normalResetPassTemplates(userReset.name.split(' ')[0],userReset.email,token),
              replyTo: 'enquiry@exciteafrica.com',
              onError: (e) => console.log(e),
              onSuccess: (i) => {
              // return res.json({code:200,message: 'Reset mail has been sent',userType:user.userType});
              console.log(i)
              },
              secure:false,
          })
          return res.json({code:200,message: 'Recieved, please check your email for more instructions on how to reset your password',userType:userReset.userType});
          
        },
      ], function(err) {
        console.log(err)
        if (err) {
        return res.json({code:400,message:err.message});
      }
      });

})




//verify the password reset
router.post('/reset/:token/:email', async function(req, res) {
  console.log(req.params.token)
    async.waterfall([
     async function(done) {
        const user = await User.findOne({ resetPasswordToken: req.params.token, email:req.params.email, resetPasswordExpires: { $gt: Date.now() } })
          if (!user) {
           return res.json({status:400,message:'Password reset token is invalid or has expired,please reset your password again'});
            
          }//authenticate here
            if (req.body.password !== req.body.password2) {
              // console.log(req.body);
              return res.json({ code: 400, error: "Password fields do not match" });
            }
              //save new password
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user.markModified("resetPasswordToken")
              user.markModified("resetPasswordExpires")
            // setpassword
           await user.setPassword(req.body.password, function(){
                            user.save(function(err){
                              if (err) console.error(err)
                              //  return res.json({code:200,message: 'Password reset was successful',userType:user.userType});
                            });  
                        });
                        done(err,user)
      },
      function(user, done) {
        // console.log(user)
        nodeoutlook.sendEmail({
          auth: {
            user: process.env.EXCITE_ENQUIRY_USER,
            pass: process.env.EXCITE_ENQUIRY_PASS,
          },
            from: 'enquiry@exciteafrica.com',
            to: user.email,
            subject: 'Your password has been changed',
            html: passwordResetConfirmation(user.email),
            text: passwordResetConfirmation(user.email),
            replyTo: 'enquiry@exciteafrica.com',
            onError: (e) => console.log(e),
            onSuccess: (i) => {
              console.log(i)
            },
            secure:false,
           
        });
        done("done");
        return res.json({code:200,message: 'Password reset was successful You can now click on the excite icon to log in to your account with your new password',userType:user.userType});
        // process.exit(1)
      }
    ], /***  function(err) {
        res.redirect('/password-forgot/forgot-password');
        return res.json({code:400,err:err.message})
     
    } **/
    );
  });

module.exports = router;