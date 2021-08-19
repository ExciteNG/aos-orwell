const router = require("express").Router();
const async = require("async");
const crypto = require("crypto");
const User = require("../models/User");
const Profile = require("../models/Profiles");
var nodeoutlook = require("nodejs-nodemailer-outlook");
const normalResetPassTemplates = require("../emails/original_password_reset");
const passwordResetConfirmation = require("../emails/password_reset_confirm");
const salesResetPassword = require("../emails/sales_reset_password");

router.post("/reset", async function(req, res) {
  // console.log(req.body.email)
  req.query.q = "forgot-password";

  async.waterfall(
    [
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      async function(token, done) {
        // console.log(done);
        const userReset = await User.findOne({ email: req.body.email });
        if (!userReset)
          return res.json({
            code: 404,
            message: "No account with this email address!",
          });
        if (userReset.userType !== "EX20AG" ) return res.json({code:401,message:"Sales account does not exist!"})
        userReset.resetPasswordToken = token;
        userReset.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await userReset.save();
        // console.log(userReset, "usr");
        nodeoutlook.sendEmail({
          auth: {
            user: process.env.EXCITE_ENQUIRY_USER,
            pass: process.env.EXCITE_ENQUIRY_PASS,
          },
          from: "enquiry@exciteafrica.com",
          to: userReset.email,
          subject: "Excite Account Password Reset",
          html: salesResetPassword(
            userReset.name.split(" ")[0],
            userReset.email,
            token
          ),
          text: salesResetPassword(
            userReset.name.split(" ")[0],
            userReset.email,
            token
          ),
          replyTo: "enquiry@exciteafrica.com",
          onError: (e) => console.log(e),
          onSuccess: (i) => {
            // return res.json({code:200,message: 'Reset mail has been sent',userType:user.userType});
            console.log(i);
          },
          secure: false,
        });
        return res.json({
          code: 200,
          message:
            "Recieved, please check your email for more instructions on how to reset your password",
          userType: userReset.userType,
        });
      },
    ],
    function(err) {
      console.log(err);
      if (err) {
        return res.json({ code: 500, message: err.message });
      }
    }
  );
});

router.post("/confirm-reset/", async function(req, res) {
  console.log(req.query.token, "token");
  const { email, token } = req.query;
  console.log(email)
  if (!email || !token) return res.status(400);
  try {
    const user = await User.findOne({
      resetPasswordToken: req.query.token,
      email: req.query.email,
      resetPasswordExpires: { $gt: Date.now() },
    });
    // console.log(user, "user");
    if (!user)
      return res.json({
        code: 400,
        message:
          "Password reset token is invalid or has expired,please reset your password again",
      });
    // console.log(user);
    if (req.body.password !== req.body.password2)
      return res.json({ code: 403, message: "Password fields do not match" });

    //save new password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.markModified("resetPasswordToken");
    user.markModified("resetPasswordExpires");
    // setpassword
    user.setPassword(req.body.password, function() {
      user.save(function(err) {
        if (err)
          return res.json({ code: 405, message: "Password reset failed" });
      });
    });
    nodeoutlook.sendEmail({
      auth: {
        user: process.env.EXCITE_ENQUIRY_USER,
        pass: process.env.EXCITE_ENQUIRY_PASS,
      },
      from: "enquiry@exciteafrica.com",
      to: user.email,
      subject: "Your password has been changed",
      html: passwordResetConfirmation(user.email),
      text: passwordResetConfirmation(user.email),
      replyTo: "enquiry@exciteafrica.com",
      onError: (e) => console.log(e),
      onSuccess: (i) => {
        console.log(i);
      },
      secure: false,
    });
    return res.json({
      code: 200,
      message:
        "Password reset was successful",
      userType: user.userType,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500);
  }
});

module.exports = router;
