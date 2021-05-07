/* eslint-disable prettier/prettier */
const router = require('express').Router();
const async = require('async');
const crypto = require('crypto');
const User = require('../models/User');
var nodeoutlook = require('nodejs-nodemailer-outlook');
const resetPassTemplates = require('../emails/password_reset')
router.post('/forgot-password', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
              res.json({code:500,message:"No account with that email address exists."});
            return res.redirect('/password-forgot/forgot-password');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        nodeoutlook.sendEmail({
            auth: {
                user: "enquiry@exciteafrica.com",
                pass: "ExciteManagement123$"
            },
            from: 'enquiry@exciteafrica.com',
            to: user.email,
            subject: 'Excite Account Password Reset',
            html: 'Tosin',
            text: resetPassTemplates,
            replyTo: 'enquiry@exciteafrica.com',
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i),
            secure:false,
        })
        done(err,'done')
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/password-forgot/forgot-password');
    });
  });


router.get('/reset/:token', async (req, res) => {
    try {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
              res.json({status:400,message:'Password reset token is invalid or has expired,please reset your password again'});
              return res.redirect('/password-forgot/forgot-password');
            }
            res.json({user:req.user})
          });
    } catch (err) {
        res.json({status:500,err:err.message})  
    }
  });

//verify the password reset
router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            res.json({status:400,message:'Password reset token is invalid or has expired,please reset your password again'});
            return res.redirect('/forgot-password');
          }
  
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
  
          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
      },
      function(user, done) {
        nodeoutlook.sendEmail({
            auth: {
                user: "enquiry@exciteafrica.com",
                pass: "ExciteManagement123$"
            },
            from: 'enquiry@exciteafrica.com',
            to: user.email,
            subject: 'Your password has been changed',
            html: resetPassTemplates,
            text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n',
            replyTo: 'enquiry@exciteafrica.com',
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i),
            secure:false,
           
        });
        done(err);
      }
    ], function(err) {
        res.redirect('/password-forgot/forgot-password');
        return res.json({code:400,err:err.message})
     
    });
  });

module.exports = router;

