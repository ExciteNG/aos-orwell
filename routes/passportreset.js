/* eslint-disable prettier/prettier */
const router = require('express').Router();
const passport = require("passport");
const PassportJWT = require("passport-jwt");
const async = require('async');
const crypto = require('crypto');
const User = require('../models/User');
const BackupCollection = require('../models/backup');
var nodeoutlook = require('nodejs-nodemailer-outlook');
const resetPassTemplates = require('../emails/password_reset')
//const resetPasswordConfirmation = require('../emails/password_reset_confirm');
const passwordResetConfirmation = require('../emails/password_reset_confirm');
const jwtSecret = process.env.JWT_SECRET;
const jwtAlgorithm = "HS256";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
passport.use(User.createStrategy());

router.post('/forgot-password', function(req, res, next) {
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
              res.json({code:500,message:"No account with that email address exists."});
            return res.redirect('/password-forgot/forgot-password');
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
                user: "enquiry@exciteafrica.com",
                pass: "ExciteManagement123$"
            },
            from: 'enquiry@exciteafrica.com',
            to: user.email,
            subject: 'Excite Account Password Reset',
            html: resetPassTemplates(token,user.email),
            text: resetPassTemplates(token,user.email),
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


router.get('/reset/:token/:email', async (req, res) => {
    try {
      BackupCollection.findOne({ Token: req.params.token, email: req.params.email, resetToken: { $gt: Date.now() } }, function(err, user) {
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
router.post('/reset/:token/:email', function(req, res) {
    async.waterfall([
      function(done) {
        BackupCollection.findOne({ Token: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            res.json({status:400,message:'Password reset token is invalid or has expired,please reset your password again'});
            return res.redirect('/password-forgot/forgot-password');
          }//authenticate here
            if (!req.body.firstName || !req.body.lastName) {
              console.log(req.body);
              return res.send({ code: 400, error: "No firstname or lastname provided." });
            } else {
                // continue
                const newUsers = {
                  email: req.body.email,
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  Token : undefined,
                  resetToken:undefined
                };
                const userInstance = new BackupCollection(newUsers);
                BackupCollection.register(userInstance, req.body.password, (error, user) => {
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
                    res.json({ code: 401, mesage: "Failed to create profile" });
                    return;
                  }
                });
                // req.user = userInstance;
                // next();
                
                res.json({ code: 201, mesage: "Account created" });
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
    ], function(err) {
        res.redirect('/password-forgot/forgot-password');
        return res.json({code:400,err:err.message})
     
    });
  });

router.get('/get-all',async (req,res) => {
  try {
    const allUsers = await BackupCollection.find({}).lean().sort({'createdAt':-1})
    res.json({allUsers,length:allUsers.length})
  } catch (error) {
    res.json({err:error.message})
  }
  
})

module.exports = router;