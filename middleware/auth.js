/* eslint-disable prettier/prettier */
const passport = require("passport");
// var nodeoutlook = require("nodejs-nodemailer-outlook");
// const crypto = require("crypto");
const JWT = require("jsonwebtoken");
// const PassportJWT = require("passport-jwt");
const User = require("../models/User");
const Profiles = require("../models/Profiles");
const randomstring = require("randomstring");
// const { use } = require("passport");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jwtSecret = process.env.JWT_SECRET;
// const jwtAlgorithm = process.env.JWT_ALGORITHM
const jwtAlgorithm = "HS256";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
//email templating
// const emailTemplate = require('./template');
passport.use(User.createStrategy());
// const Cookies = require("cookies");

const generateRefNo = randomstring.generate({
  length: 12,
  charset: "alphanumeric",
  readable: true,
});

/*                  SIGNUPs                         */

// Merchants
const signUp = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.send({ code: 400, error: "No username or password provided." });
  }
  // console.log(req.body);
  await User.findOne({ email: req.body.email }, async (err, doc) => {
    if (doc) {
      // console.log(doc);
      return res.json({ code: 401, msg: "this Account already exists", doc });
      // next(err);
    } else {
      const user = {
        email: req.body.email,
        username: req.body.username,
        fullname: req.body.fullname,
        userType: "EX10AF",
        emailVerified: false,
        verifyToken: generateRefNo,
      };
      const userInstance = new User(user);
      User.register(userInstance, req.body.password, (error, user) => {
        if (error) {
          // next(error);
          return res.json({ code: 401, message: "Failed to create account" });
        }
      });
      //
      const profileInstance = new Profiles(userInstance);
      profileInstance.fullname = req.body.fullname;
      await profileInstance.save()
      return res.json({
        code: 201,
        mesage:
          "Account created Please check your email to verify your account",
      });
    }
  });
};


/*                  SIGN JWTS                        */
// Merchants Login
const signJWTForUser = (req, res) => {
  try {
    const user = req.user;
    const token = JWT.sign(
      {
        email: user.email,
        userType: user.userType,
      },
      jwtSecret,
      {
        algorithm: jwtAlgorithm,
        expiresIn: jwtExpiresIn,
        subject: user._id.toString(),
      }
    );
    return res.json({ token });
  } catch (err) {
    return res.json({ code: 400, message: err.message });
  }
};


module.exports = {
  initialize: passport.initialize(),
  signUp,
  signIn: passport.authenticate("local", { session: false }),
  requireJWT: passport.authenticate("jwt", { session: false }),
  signJWTForUser,
};
