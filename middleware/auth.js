/* eslint-disable prettier/prettier */
const passport = require("passport");
// var nodeoutlook = require("nodejs-nodemailer-outlook");
// const crypto = require("crypto");
const JWT = require("jsonwebtoken");
// const PassportJWT = require("passport-jwt");

// MODELS
const User = require("../models/User");
const Company = require("../models/Company");

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

// Company
const signUp = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.send({ code: 400, error: "No username or password provided." });
  }
  try {
    const isExist = await User.findOne({ email: req.body.email.toLowerCase() });
  if (isExist)
    return res.json({ code: 401, msg: "this Account already exists" });
    const user = {
      ...req.body,
      email: req.body.email.toLowerCase(),
      accountType: "PT02",
      emailVerified: false,
      verifyToken: generateRefNo,
    };
    const userInstance = new User(user);
    User.register(userInstance, req.body.password, async (error, user) => {
      if (error) {
        return res.status(400).json({ code: 401, message: "Failed to create account" });
      }
       // if  no error 
     const profileInstance = new Company({...req.body, accountType:"PT02"});
     if(!profileInstance) return res.status(400).json({msg:"Bad Request"})

     const company = await profileInstance.save();

     if(!company) return res.status(400).json({msg:"Bad Request"})
     //TODO SEND WELCOME EMAIL
      
     return res.status(200).json({msg:"Account created"})
    });
  } catch (error) {
    return res.status(500)
  }
};

/*                  SIGN JWTS                        */
// Company Login
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
