/* eslint-disable prettier/prettier */
const passport = require("passport");
var nodeoutlook = require("nodejs-nodemailer-outlook");
const crypto = require("crypto");
const JWT = require("jsonwebtoken");
const PassportJWT = require("passport-jwt");
const User = require("../models/User");
const Profile = require("../models/Profiles");
const Affiliates = require("../models/Affiliates");
const Partners = require("../models/Partners");
const Influencers = require("../models/influencer");
const randomstring = require("randomstring");
const { use } = require("passport");
// const sgMail = require("@sendgrid/mail");
const verifyEmail = require("../emails/verify_template");
const partnersAcknowledgeMail = require("../emails/partner_acknow");
const affiliateAcknowledge = require("../emails/affiliate_acknowledge");
const influencerAcknowledge = require("../emails/influencer_acknowledge");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jwtSecret = process.env.JWT_SECRET;
// const jwtAlgorithm = process.env.JWT_ALGORITHM
const jwtAlgorithm = "HS256";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
//email templating
// const emailTemplate = require('./template');
passport.use(User.createStrategy());
const Cookies = require("cookies");
/*                  SIGNUPs                         */

// Merchants
const signUp = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.send({ code: 400, error: "No username or password provided." });
  }
  if (req.body.password.length < 8) {
    return res.send({
      code: 400,
      error: "password must be at least eight characters long",
    });
  }
  // console.log(req.body);
  await User.findOne({ email: req.body.email }, (err, doc) => {
    if (doc) {
      // console.log(doc);
      res.json({ code: 401, msg: "Account exist", doc });
      next(err);
    } else {
      // continue
      const generateRefNo = randomstring.generate({
        length: 12,
        charset: "alphanumeric",
        readable: true,
      });

      const user = {
        email: req.body.email,
        fullname: req.body.fullname,
        username: req.body.username,
        name: req.body.fullname,
        userType: "EX10AF",
        emailVerified: false,
        verifyToken: generateRefNo,
      };
      const userInstance = new User(user);
      User.register(userInstance, req.body.password, (error, user) => {
        if (error) {
          // next(error);
          res.json({ code: 401, mesage: "Failed to create account" });
          return;
        }
      });
      //
      const profileInstance = new Profile(userInstance);
      profileInstance.fullname = req.body.fullname;
      profileInstance.save((err, doc) => {
        if (err) {
          // next(err);
          res.json({ code: 401, mesage: "Failed to create profile" });
          return;
        }
      });
      // req.user = userInstance;
      // next();
      //send mail
      nodeoutlook.sendEmail({
        auth: {
          user: process.env.EXCITE_ENQUIRY_USER,
          pass: process.env.EXCITE_ENQUIRY_PASS,
        },
        from: "enquiry@exciteafrica.com",
        to: user.email,
        subject: "Verify Your Account",
        html: verifyEmail(user.username, user.email, user.verifyToken),
        text: verifyEmail(user.username, user.email, user.verifyToken),
        replyTo: "enquiry@exciteafrica.com",
        onError: (e) => console.error(e),
        onSuccess: (i) => console.log(i),
        secure: false,
      });
     return res.json({ code: 201, mesage: "Account created Please check your email to verify your account" });
    }
  });
};

// Partners
const signUpPartner = (req, res, next) => {
  const {
    email,
    password,
    phone,
    fullname,
    lga,
    state,
    companyName,
    rc,
    tin,
    serviceRendered,
    taxCert,
    cacCert,
    address,
  } = req.body;

  // console.log(req.body);
  const handleNature = () => {
    switch (serviceRendered) {
      case "Tax Services":
        return "EX50AFTAX";
      case "Business Registration":
        return "EX50AFBIZ";
      case "Loan Services":
        return "EX50AFFIN";
      default:
        break;
    }
  };
  // console.log(req.body)
  if (!email || !password) {
    return res
      .status(400)
      .send({ code: 400, error: "No email or password provided." });
  }
  if (password.length < 8) {
    return res.send({
      code: 400,
      error: "password must be at least eight characters long",
    });
  }
  User.findOne({ email: email }, (err, doc) => {
    if (doc) {
      // conso
      res.json({ code: 401, msg: "Account exist", doc });
      next(err);
    } else {
      //continue
      const generateRefNo = randomstring.generate({
        length: 4,
        charset: "numeric",
        readable: true,
      });

      const user = {
        email: req.body.email,
        fullname: req.body.companyName,
        userType: handleNature(),
        emailVerified: false,
      };
      const userInstance = new User(user);
      User.register(userInstance, req.body.password, (error, user) => {
        if (error) {
          // next(error);
          res.json({ code: 401, mesage: "Failed create account" });

          return;
        }
      });
      const partnerInstance = new Partners(userInstance);
      partnerInstance.fullname = fullname;
      partnerInstance.phone = phone;

      partnerInstance.company = {
        name: companyName,
        address: address,
        rc: rc,
        tin: tin,
        nature: serviceRendered,
      };
      // very important : telling mongoose that this field has been modified
      partnerInstance.markModified("company");
      partnerInstance.identification = {
        idType: "",
        id: "",
        passport: "",
        signature: "",
        cacCert: cacCert,
        taxCert: taxCert,
      };
      partnerInstance.location = { address: address, state: state, lga: lga };

      partnerInstance.save((err, doc) => {
        if (err) {
          // next(err);
          res.json({ code: 401, mesage: "Failed to create profile" });
          return;
        }

        //send mail
        nodeoutlook.sendEmail({
          auth: {
            user: process.env.EXCITE_ENQUIRY_USER,
            pass: process.env.EXCITE_ENQUIRY_PASS,
          },
          from: "enquiry@exciteafrica.com",
          to: user.email,
          subject: "Welcome",
          html: partnersAcknowledgeMail(),
          text: partnersAcknowledgeMail(),
          replyTo: "enquiry@exciteafrica.com",
          onError: (e) => console.log(e),
          onSuccess: (i) => console.log(i),
          secure: false,
        });

        // send mail
        res.json({ code: 201, mesage: "Your Account has been successfully created, please check your email for the next steps" });
      });
      // req.user = userInstance;
      // res.json({ code: 201, mesage: "Account created" });
      // next();
    }
  });
};

// Affiliates
const signUpAffiliates = async (req, res, next) => {
  const {
    email,
    password,
    phone,
    fullname,
    lga,
    state,
    cell,
    idType,
    idImg,
    passportImg,
    address,
    broughtBy
  } = req.body;
  if (!email || !password) {
    return res.json({ status: 400, code: "No email or password provided" });
  }
  if (password.length < 8) {
    return res.send({
      code: 400,
      error: "password must be at least eight characters long",
    });
  }

  const validEmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
  if (!validEmail) {
    res.json({ message: "invalid email", code: 400 });
  }

  await User.findOne({ email: req.body.email }, (err, doc) => {
    if (err) {
      res.json({ code: 401, msg: "Error ocured" });
    }
    if (doc) {
      // console.log(doc);
      res.json({ code: 401, msg: "Account exist", doc });
      next(err);
    } else {
      //continue
      const generateRefNo = randomstring.generate({
        length: 12,
        charset: "alphanumeric",
        readable: true,
     });
      //  let clientRefNo= `HR-CL-${generateRefNo}`,

      const user = {
        email: email,
        name: fullname,
        userType: "EX20AF",
        emailVerified: false,
      };
      const userInstance = new User(user);
      User.register(userInstance, req.body.password, (error, user) => {
        if (error) {
          // next(error);
          res.json({ code: 401, mesage: "Failed create account" });
          return;
        }
      });

      const profileInstance = new Affiliates(userInstance);
      profileInstance.fullname = fullname;
      profileInstance.phone = phone;
      profileInstance.broughtBy=broughtBy;
      profileInstance.cellInfo = {
        cell: cell,
        cellGroup: "",
        isCellHead: false,
        isClusterHead: false,
        cluster: "",
      };
      profileInstance.identification = {
        idType: idType,
        id: idImg,
        passport: passportImg,
        signature: "",
      };
      profileInstance.location = { address: address, state: state, lga: lga };

      profileInstance.save((err, doc) => {
        if (err) {
          // next(err);
          res.json({ code: 401, mesage: "Failed to create profile" });
          return;
        }
      });
      // req.user = userInstance;
      //send mail
      nodeoutlook.sendEmail({
        auth: {
          user: process.env.EXCITE_ENQUIRY_USER,
          pass: process.env.EXCITE_ENQUIRY_PASS,
        },
        from: "enquiry@exciteafrica.com",
        to: user.email,
        subject: "ACKNOWLEDGEMENT EMAIL",
        html: affiliateAcknowledge(),
        text: affiliateAcknowledge(),
        replyTo: "enquiry@exciteafrica.com",
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i),
        secure: false,
      });
      res.json({ code: 201, mesage: "Account created" });
      // next();
    }
  });
};

// Signup User Via Refcode
const signUpRefCode = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("No email or password provided.");
  }
  if (req.body.password.length < 8) {
    return res.send({
      code: 400,
      error: "password must be at least eight characters long",
    });
  }
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (doc) {
      // console.log(doc);
      res.json({ code: 401, msg: "Account exist", doc });
      next(err);
    } else {
      //continue
      const user = {
        email: req.body.email.toLowerCase(),
        userType: "EX10AF",
        emailVerified: false,
        fullname: req.body.fullname,
        username: req.body.username,
        name: req.body.fullname,
      };
      const userInstance = new User(user);
      User.register(userInstance, req.body.password, (error, user) => {
        if (error) {
          // next(error);
          res.json({ code: 400, mesage: "Failed create account" });

          return;
        }
      });
      const profileInstance = new Profile({ ...userInstance, ...user });
      const profileId = profileInstance._id;
      let profiler = profileInstance;
      profiler.referral.isReffered = true;
      profiler.referral.refCode = req.body.refCode;
      profiler.refBy = req.body.refCode;
      profileInstance.save((err, doc) => {
        if (err) {
          // next(err);
          res.json({ code: 400, mesage: "Failed to create profile" });
          return;
        }
      });
      // TODO restructure
      const refBy = await Affiliates.findOne({
        affiliateCode: req.body.refCode,
      });
      console.log(refBy, "here", req.body.refCode);

      if (!refBy) return res.json({ code: 201, mesage: "Account created" });
      if (refBy) {
        refBy.merchants.push(profileId);
        refBy.markModified("merchants");
        await refBy.save();
        //send mail
        nodeoutlook.sendEmail({
          auth: {
            user: process.env.EXCITE_ENQUIRY_USER,
            pass: process.env.EXCITE_ENQUIRY_PASS,
          },
          from: "enquiry@exciteafrica.com",
          to: user.email,
          subject: "ACKNOWLEDGEMENT EMAIL",
          html: affiliateAcknowledge(),
          text: affiliateAcknowledge(),
          replyTo: "enquiry@exciteafrica.com",
          onError: (e) => console.log(e),
          onSuccess: (i) => console.log(i),
          secure: false,
        });
        res.json({ code: 201, mesage: "Account created" });
      }
    }
  });
};

const setUpSpringBoard = (req, res, next) => {
  if (req.body.token !== process.env.SPRING_BOARD_ACCESS_TOKEN)
    return res.json({ code: 400, msg: "Invalid Token" });
  if (!req.body.email || !req.body.password) {
    res.send({ code: 400, error: "No username or password provided." });
  }
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (doc) {
      // console.log(doc);
      res.json({ code: 401, msg: "Account exist" });
      next(err);
    } else {
      //continue
      const user = {
        email: req.body.email,
        name: "SpringBoard",
        userType: "EXSBAF",
        emailVerified: true,
      };
      const userInstance = new User(user);
      User.register(userInstance, req.body.password, (error, user) => {
        if (error) {
          // next(error);
          res.json({ code: 400, mesage: "Failed create account" });
          return;
        }
        res.json({ code: 201, mesage: "Account Set Successfully." });
      });
    }
  });
};

//SIGN UP Influencers
const signUpInfluencers = async (req, res, next) => {
  try {
    const {
      // fullName,
      // email,
      // userType,
      // emailVerified,
      // password,
      // Address,
      mobile,
      StateOfResidence,
      socialmediaplatform,
      socialmediahandles,
      noOfFollowers,
      influencerLevel,
      AmountPerPost,
      country,
      coverage,
      marketingSpecialty,
      Negotiable,
      // website,
      // AverageDailyVisitors,
      // socialmediaplatform,
      // socialmediahandles,
      // marketingSpecialty,
      // AmountPerPost,
      // AbletoDiscount,
      // profilePhoto,
      // regStatus
    } = req.body;

    if (!req.body.email || !req.body.password || !req.body) {
      return res.json({ status: 400, code: "No email or password provided" });
    }
    if (req.body.password.length < 8) {
      return res.send({
        code: 400,
        error: "password must be at least eight characters long",
      });
    }
    await User.findOne({ email: req.body.email }, (err, doc) => {
      if (err) {
        res.json({ code: 401, msg: "An Error ocured" });
      }
      if (doc) {
        // console.log(doc);
        res.json({ code: 401, msg: "This Account already exists", doc });
        next(err);
      } else {
        //continue

        const user = {
          email: req.body.email,
          name: req.body.fullName,
          userType: "EX90IF",
          emailVerified: false,
        };
        const userInstance = new User(user);
        User.register(userInstance, req.body.password, (error, user) => {
          if (error) {
            // next(error);
            res.json({ code: 400, mesage: "Failed create account" });
            return;
          }
        });
        const newInfluencer = new Influencers({ ...user, ...req.body });
        // newInfluencer.Address = Address;
        // newInfluencer.mobile = mobile;
        // newInfluencer.telephone = telephone;
        // newInfluencer.country = country;
        // newInfluencer.StateOfResidence = StateOfResidence;
        // newInfluencer.website = website;
        // newInfluencer.AverageDailyVisitors = AverageDailyVisitors;
        // newInfluencer.socialmediaplatform = socialmediaplatform;
        // newInfluencer.socialmediahandles = socialmediahandles;
        // newInfluencer.marketingSpecialty = marketingSpecialty;
        // newInfluencer.AmountPerPost = AmountPerPost;
        // newInfluencer.AbletoDiscount = AbletoDiscount;
        // newInfluencer.profilePhoto = profilePhoto;
        // newInfluencer.regStatus = regStatus;

        newInfluencer.save();
        //send mail
        nodeoutlook.sendEmail({
          auth: {
            user: process.env.EXCITE_ENQUIRY_USER,
            pass: process.env.EXCITE_ENQUIRY_PASS,
          },
          from: "enquiry@exciteafrica.com",
          to: req.body.email,
          subject: "ACKNOWLEDGEMENT EMAIL",
          html: influencerAcknowledge(),
          text: influencerAcknowledge(),
          replyTo: "enquiry@exciteafrica.com",
          onError: (e) => console.log(e),
          onSuccess: (i) => console.log(i),
          secure: false,
        });
        return res.json({ code: 201, success: "account created successfully" });
      }
    });
  } catch (err) {
    return res.json({ code: 400, message: err.message });
  }
};

const setUpAdmin = async (req, res, next) => {
  if (req.body.token !== process.env.EXCITE_ADMIN_ACCESS_TOKEN)
    return res.json({ code: 400, msg: "Invalid Token" });
  if (!req.body.email || !req.body.password) {
    return res.send({ code: 400, error: "No email or password provided." });
  }
  // console.log(req.body)
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (doc) {
      console.log(doc);
      return res.json({ code: 401, msg: "Account exist" });
    } else {
      //continue
      const user = {
        email: req.body.email,
        name: "Excite Africa",
        userType: "EXMANAF",
        emailVerified: true,
      };
      const userInstance = new User(user);
      User.register(userInstance, req.body.password, (error, user) => {
        if (error) {
          // next(error);
          return res.json({ code: 400, mesage: "Failed create account" });
        }
      });
      return res.json({ code: 201, mesage: "Account Set Successfully." });
    }
  });
};

/*                  SIGN JWTS                        */
// Merchants Login
const signJWTForUser = (req, res) => {
  // console.log('signing jwt', req.user)
  // check login route authorization
  // if (req.user.userType !== "EX10AF")
  //   return res.status(400).json({ msg: "invalid login" });
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

// Affiliates Login
const signJWTForAffiliates = (req, res) => {
  try {
    // console.log('sign  ing jwt', req.user)
    // check login route authorization
    if (req.user.userType !== "EX20AF")
      return res.status(400).json({ msg: "invalid login" });
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
    // console.log(token);
    return res.json({ token });
  } catch (err) {
    return res.json({ code: 400, message: err.mesage });
  }
};

// Partners Login
const signJWTForPartners = (req, res) => {
  try {
    // console.log('signing jwt', req.user)
    // check login route authorization
    const org = req.user.userType;

    if (
      req.user.userType === "EX50AFTAX" ||
      req.user.userType === "EX50AFBIZ" ||
      req.user.userType === "EX50AFFIN"
    ) {
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
    }
    return res
      .status(400)
      .json({ user: req.user.userType, msg: "invalid login" });
  } catch (err) {
    return res.json({ code: 400, meessage: err.message });
  }
};

// influencer login JWT
const signJWTForInfluencers = (req, res) => {
  try {
    // console.log('signing jwt', req.user)
    // check login route authorization
    const org = req.user.userType;

    if (req.user.userType === "EX90IF") {
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
    }
    return res
      .status(400)
      .json({ user: req.user.userType, msg: "invalid login" });
  } catch (err) {
    return res.json({ code: 500, message: err.message });
  }
};

// SpringBoards Login
const signJWTForSpringBoard = (req, res) => {
  // console.log('signing jwt', req.user)
  // check login route authorization
  if (req.user.userType !== "EXSBAF")
    return res.status(400).json({ msg: "invalid login" });
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
  // console.log(token);
  res.json({ token });
};
// Excite Admin Login
const signJWTForExcite = (req, res) => {
  // console.log('signing jwt', req.user)
  // check login route authorization
  if (req.user.userType !== "EXMANAF")
    return res.status(400).json({ msg: "invalid login" });
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
  // console.log(token);
  res.json({ token });
};

//influencer dashbaord authorization
const authInfluencerMarketer = (req, res) => {
  if (req.user.userType !== "EX901F")
    return res
      .status(400)
      .json({ msg: "you are not authorized to view this resource" });
  res.json({ code: 200, auth: true });
};

passport.use(
  new PassportJWT.Strategy(
    {
      jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      algorithms: [jwtAlgorithm],
    },
    (payload, done) => {
      User.findById(payload.sub)
        .then((user) => {
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        })
        .catch((error) => {
          done(error, false);
        });
    }
  )
);

//write a reset password middleware
// const passwordResetMiddleware = (req,res,next) => {
//   User.findOne({email:req.body.email}, (err,doc)=>{
//     if (err){
//       return res.json({code:401,message:"You are unauthorized to view this resource"})
//     }else{
//       console.log(doc)
//     }
//   })
//   next();
// }

//reset a user password
const passwordReset = (req, res) => {
  //create a lookup to verify user
  User.findOne({ email: req.body.email }, (err, doc) => {
    if (err) {
      return res.json({
        code: 401,
        message: "You are unauthorized to view this resource",
      });
    }
  });
  let userTypeList = ["EX10AF", "EX20AF", "EX50AF", "EXSBAF"];
  if (!req.user.userType.includes(userTypeList)) {
    return res.json({
      code: 401,
      message: "You are unauthorized to view this resource",
    });
  }
  passport.setPassword(req.body.password, function(err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
    }
  });
};

module.exports = {
  initialize: passport.initialize(),
  signUp,
  signUpAffiliates,
  signUpInfluencers,
  signUpPartner,
  signUpRefCode,
  setUpSpringBoard,
  setUpAdmin,
  signIn: passport.authenticate("local", { session: false }),
  requireJWT: passport.authenticate("jwt", { session: false }),
  signJWTForUser,
  signJWTForAffiliates,
  signJWTForInfluencers,
  signJWTForPartners,
  signJWTForSpringBoard,
  signJWTForExcite,
  passwordReset,
};
