/* eslint-disable no-unused-expressions */
/* eslint-disable prettier/prettier */
const router = require('express').Router();
const async = require('async');
const crypto = require('crypto');
const User = require('../models/User');
const Profile = require('../models/Profiles')
var nodeoutlook = require('nodejs-nodemailer-outlook');
const normalResetPassTemplates = require('../emails/original_password_reset');
//const resetPasswordConfirmation = require('../emails/password_reset_confirm');
const passwordResetConfirmation = require('../emails/password_reset_confirm');


router.post('/forgot-password', function (req,res,next) {

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
              // return res.redirect('/password-forgot/forgot-password');
            }
            
            user.resetPasswordToken = token,
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
              html: normalResetPassTemplates(user.name,user.email,token),
              text: normalResetPassTemplates(user.name,token,user.email),
              replyTo: 'enquiry@exciteafrica.com',
              onError: (e) => console.log(e),
              onSuccess: (i) => console.log(i),
              secure:false,
          })
          done('done')
        }
      ], function(err) {
        if (err) return next(err);
        res.json({code:400,message:err.message});
      });

})


router.get('/reset/:token/:email', async (req, res) => {
    try {
      User.findOne({ resetPasswordToken: req.params.token, email: req.params.email, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
              res.json({status:400,message:'Password reset token is invalid or has expired,please reset your password again'});
             // return res.redirect('/password-forgot/forgot-password');
            }
            res.json({user:req.user,email:req.email})
          });
    } catch (err) {
        res.json({status:500,err:err.message})  
    }
  });


//verify the password reset
router.post('/reset/:token/:email', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, email:req.params.email, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            res.json({status:400,message:'Password reset token is invalid or has expired,please reset your password again'});
            
          }//authenticate here
            if (req.body.password !== req.body.password2) {
              console.log(req.body);
              return res.json({ code: 400, error: "Password fields do not match" });
            }
              //save new password
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              //login user
            //   user.save(function(err) {
            //         req.logIn(user, function(err) {
            //           done(err, user);
            //         });
            //       });
            //       //
            user.setPassword(req.body.password, function(){
                            user.save(function(err){
                                res.json({code:200,message: 'password reset successful'});
                                done(err,user)
                            });
                        });


                  //


            });
        //   user.password = req.body.password;
        //   user.Token = undefined;
        //   user.resetToken = undefined;
  
        //   user.save(function(err) {
        //     req.logIn(user, function(err) {
        //       done(err, user);
        //     });
        //   });
        // });
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
            html: passwordResetConfirmation(user.email),
            text: passwordResetConfirmation(user.email),
            replyTo: 'enquiry@exciteafrica.com',
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i),
            secure:false,
           
        });
        done(err);
      }
    ], /***  function(err) {
        res.redirect('/password-forgot/forgot-password');
        return res.json({code:400,err:err.message})
     
    } **/
    );
  });

module.exports = router;
