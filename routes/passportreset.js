/* eslint-disable prettier/prettier */
const router = require('express').Router();
const async = require('async');
const crypto = require('crypto');
const User = require('../models/User');
const BackupCollection = require('../models/backup');
const Profile = require('../models/Profiles')
var nodeoutlook = require('nodejs-nodemailer-outlook');
const resetPassTemplates = require('../emails/password_reset');
//const resetPasswordConfirmation = require('../emails/password_reset_confirm');
const passwordResetConfirmation = require('../emails/password_reset_confirm');

router.post('/recover-account', function(req, res, next) {
  // console.log(req.body.email)
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        BackupCollection.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
             return res.json({code:500,message:"No previous account with that email address."});
          }
          user.Token = token;
          user.resetToken = Date.now() + 3600000; // 1 hour
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        nodeoutlook.sendEmail({
            auth: {
                user: process.env.EXCITE_ENQUIRY_USER,
                pass: process.env.EXCITE_ENQUIRY_PASS
            },
            from: process.env.EXCITE_ENQUIRY_USER,
            to: user.email,
            subject: 'Excite Account Password Reset',
            html: resetPassTemplates(user.firstName,token,user.email),
            text: resetPassTemplates(user.firstName,token,user.email),
            replyTo: 'enquiry@exciteafrica.com',
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i),
            secure:false,
        })
        return res.json({code:200,message:"Check your email for next step"})
        done('done')
      }
    ], function(err) {
      if (err) return 
      // res.json({code:400,message:err.message});
    });
  });


//verify the password reset for old account
router.post('/reset/:token/:email', function(req, res) {
    async.waterfall([
      function(done) {
        BackupCollection.findOne({ Token: req.params.token, email:req.params.email, resetToken: { $gt: Date.now() } }, async function(err, user) {
          if (!user) {
            return res.json({code:400,message:'Password reset token is invalid or has expired,please reset your password again'});
            
          }//authenticate here
            if (req.body.password !== req.body.password2) {
              // console.log(req.body);\
              return res.json({ code: 401, error: "Password fields do not match" });
            }

            const exist = await User.findOne({email:req.params.email});
            if(exist) return res.json({ code: 401, error: "this Account already exists" });
                // continue
                const newUsers = {
                  email: req.params.email,
                  name:user.firstName + ' ' + user.lastName,
                  verifyToken:req.params.token,
                  emailVerified:true,
                  userType:"EX10AF",
                  resetPasswordToken: undefined,
                  resetPasswordExpires: undefined
                };
                const userInstance = new User(newUsers);
                User.register(userInstance, req.body.password, (error, user) => {
                  if (error) {
                    // next(error);
                   return res.json({ code: 401, mesage: "Failed to create account" });
                    
                  }
                });
                //
                const profileInstance = new Profile(userInstance);
                profileInstance.fullname = req.body.firstName + ' ' + req.body.lastName;
                profileInstance.save((err, doc) => {
                  if (err) {
                    // next(err);
                   return res.json({ code: 401, mesage: "Failed to recover profile" });
                  
                  }
                });
                // req.user = userInstance;
                // next();
                
                // res.json({ code: 201, mesage: "Account recovered, proceed to login" });
                done(err,user)
            
            });
      },
      function(user, done) {
        nodeoutlook.sendEmail({
            auth: {
              user: process.env.EXCITE_ENQUIRY_USER,
              pass: process.env.EXCITE_ENQUIRY_PASS
            },
            from: process.env.EXCITE_ENQUIRY_USER,
            to: user.email,
            subject: 'Your password has been changed',
            html: passwordResetConfirmation(user.email),
            text: passwordResetConfirmation(user.email),
            replyTo: 'enquiry@exciteafrica.com',
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i),
            secure:false,
           
        });
        return res.json({ code: 201, mesage: "Account recovered, proceed to login" });
        done("");
      }
    ], /***  function(err) {
        res.redirect('/password-forgot/forgot-password');
        return res.json({code:400,err:err.message})
     
    } **/
    );
  });

// Version Two user password reset


module.exports = router;

