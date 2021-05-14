/* eslint-disable prettier/prettier */
const router = require('express').Router();
const async = require('async');
const crypto = require('crypto');
const User = require('../models/User');
const BackupCollection = require('../models/backup');
const Profile = require('../models/Profiles')
var nodeoutlook = require('nodejs-nodemailer-outlook');
const resetPassTemplates = require('../emails/password_reset')
//const resetPasswordConfirmation = require('../emails/password_reset_confirm');
const passwordResetConfirmation = require('../emails/password_reset_confirm');

router.post('/recover-account', function(req, res, next) {
  console.log(req.body.email)
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
             return res.json({code:500,message:"No account with that email address exists."});
          }
          user.Token = token;
          user.resetToken = Date.now() + 3600000; // 1 hour
          user.save(function(err) {
            res.json({token})
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
            html: resetPassTemplates(token,user.email),
            text: resetPassTemplates(token,user.email),
            replyTo: 'enquiry@exciteafrica.com',
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i),
            secure:false,
        })
        done('done')
      }
    ], function(err) {
      if (err) return 
      // res.json({code:400,message:err.message});
    });
  });


router.get('/reset/:token/:email', async (req, res) => {
    try {
      BackupCollection.findOne({ Token: req.params.token, email: req.params.email, resetToken: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
              res.json({status:400,message:'Password reset token is invalid or has expired,please reset your password again'});
              return res.redirect('/password-forgot/forgot-password');
            }
            res.json({user:req.user,email:req.email})
          });
    } catch (err) {
        res.json({status:500,err:err.message})  
    }
  });

//verify the password reset for old account
router.post('/reset/:token/:email', function(req, res) {
    async.waterfall([
      function(done) {
        BackupCollection.findOne({ Token: req.params.token, email:req.params.email, resetToken: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            return res.json({status:400,message:'Password reset token is invalid or has expired,please reset your password again'});
            
          }//authenticate here
            if (req.body.password !== req.body.password2) {
              // console.log(req.body);\
              return res.json({ code: 400, error: "Password fields do not match" });
            } else {
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
                    res.json({ code: 401, mesage: "Failed to create account" });
                    return;
                  }
                });
                //
                const profileInstance = new Profile(userInstance);
                profileInstance.fullname = req.body.firstName + ' ' + req.body.lastName;
                profileInstance.save((err, doc) => {
                  if (err) {
                    // next(err);
                    res.json({ code: 401, mesage: "Failed to recover profile" });
                    return;
                  }
                });
                // req.user = userInstance;
                // next();
                
                res.json({ code: 201, mesage: "Account recovered" });
                done(err,user)
              }
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
        done("");
      }
    ], /***  function(err) {
        res.redirect('/password-forgot/forgot-password');
        return res.json({code:400,err:err.message})
     
    } **/
    );
  });

router.get('/get-all',async (req,res) => {
  try {
    const allUsers = await BackupCollection.find({}).lean().sort({'createdAt':-1})
    res.json({allUsers,length:allUsers.length})
  } catch (error) {
    res.json({err:error.message})
  }
  
})


// Version Two user password reset


module.exports = router;