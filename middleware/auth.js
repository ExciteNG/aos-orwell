/* eslint-disable prettier/prettier */
const passport = require("passport");
const crypto = require('crypto');
const JWT = require("jsonwebtoken");
const PassportJWT = require("passport-jwt");
const User = require("../models/User");
const Profile = require("../models/Profiles");
const Partners = require("../models/Partners");
const randomstring = require("randomstring");
const { use } = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jwtSecret = process.env.JWT_SECRET;
// const jwtAlgorithm = process.env.JWT_ALGORITHM
const jwtAlgorithm = "HS256";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
//email templating 
const emailTemplate = require('./template');
passport.use(User.createStrategy());

/*                  SIGNUPs                         */

// Merchants
const signUp = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
   return  res.send({code:400,error:"No username or password provided."});
  }
  // console.log(req.body)
  User.findOne({ email: req.body.email }, (err, doc) => {
    if (doc) {
      // console.log(doc);
      res.json({ code: 401, msg: "Account exist", doc });
      next(err);
    } else {
      // continue
      const generateRefNo = randomstring.generate({
        length: 4,
        charset: "numeric",
        readable: true,
      });

      const user = {
        email: req.body.email,
        fullname: req.body.name,
        userType: "EX10AF",
        emailVerified: false,
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
      profileInstance.fullname=req.body.fullname
      profileInstance.save((err, doc) => {
        if (err) {
          // next(err);
          res.json({ code: 401, mesage: "Failed to create profile" });
          return;
        }
      });
      // req.user = userInstance;
      res.json({ code: 201, mesage: "Account created" });
      // next();
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
  const handleNature =()=>{
    switch (serviceRendered) {
      case "Tax Services":
        return "EX50AFTAX"
      case "Business Registration":
        return "EX50AFBIZ"
      case "Loan Services":
        return "EX50AFFIN"
      default:
        break;
    }
  }
console.log(req.body)
  if (!email || !password) {
    res.status(400).send("No username or password provided.");
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
        name: req.body.companyName,
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
      const partnerInstance = new Profile(userInstance);
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
      // profile.markModified("company");
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
      });
      // req.user = userInstance;
      res.json({ code: 201, mesage: "Account created" });
      // next();
    }
  });
};

// Affiliates
const signUpAffiliates = (req, res, next) => {
  let token = crypto.randomBytes(12).toString('hex');
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
  } = req.body;
  if (!email || !password) {
    res.json({"status":400,code:"No username or password provided"});
  }
  
  User.findOne({ email: req.body.email }, (err, doc) => {
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
        length: 4,
        charset: "numeric",
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

      const profileInstance = new Profile(userInstance);
      profileInstance.fullname = fullname;
      profileInstance.phone = phone;
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
      res.json({ code: 201, mesage: "Account created" });
      // next();
    }
  })
}



//verify account via the email token
// const verifyAffiliateToken =  (req,res) =>{
//   User.findOne({ authToken: req.params.token}, function(err, user) {
//     if (!user) {
//       res.json('You are not valid user');
//       res.redirect('/auth/affiliate/sign-up');
//     } else {
//       res.json("you are now registered and you can log In...")
//       res.redirect('/auth/login/affiliates')
//     }
//   });
// }


// Signup User Via Refcode
const signUpRefCode =async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("No username or password provided.");
  }
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (doc) {
      // console.log(doc);
      res.json({ code: 401, msg: "Account exist", doc });
      next(err);
    } else {
      //continue

      const user = {
        email: req.body.email,
        name: req.body.name,
        userType: "EX10AF",
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
      const profileInstance = new Profile(userInstance);
      let profiler = profileInstance
      profiler.referral.isReffered = true
      profiler.referral.refCode = req.body.refCode;
      profileInstance.save((err, doc) => {
        if (err) {
          // next(err);
          res.json({ code: 400, mesage: "Failed to create profile" });
          return;
        }
      });
// TODO restructure
      const refBy = await Profile.findOne({affiliateCode:req.body.refCode})

      if(!refBy) return   res.json({ code: 201, mesage: "Account created" });
      if(refBy){
        let currentCnt = refBy.affiliateCount;
        refBy.affiliateCount = currentCnt + 1;
        refBy.markModified('affiliateCount')
        refBy.save()
        res.json({ code: 201, mesage: "Account created" });
      }
      // req.user = userInstance;
    
      // next();
    }
  });
};

const setUpSpringBoard = (req,res,next)=>{
  if(req.body.token !== process.env.SPRING_BOARD_ACCESS_TOKEN) return res.status(400).json({msg:"Invalid Token"})
  if (!req.body.email || !req.body.password) {
    res.status(400).send("No username or password provided.");
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
        name: 'SpringBoard',
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
}
const setUpAdmin =async (req,res,next)=>{
  if(req.body.token !== process.env.EXCITE_ADMIN_ACCESS_TOKEN) return res.status(400).json({msg:"Invalid Token"})
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("No username or password provided.");
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
        name: 'Excite Africa',
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
      return  res.json({ code: 201, mesage: "Account Set Successfully." });
    }
  });
}



/*                  SIGN JWTS                        */
// Merchants Login
const signJWTForUser = (req, res) => {
  // console.log('signing jwt', req.user)
  // check login route authorization
  if (req.user.userType !== "EX10AF")
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
// Affiliates Login
const signJWTForAffiliates = (req, res) => {
  // console.log('signing jwt', req.user)
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
  res.json({ token });
};
// Partners Login
const signJWTForPartners = (req, res) => {
  // console.log('signing jwt', req.user)
  // check login route authorization
  // const org = req.user.userType
  if (req.user.userType !== ("EX50AFTAX" || "EX50AFBIZ" || "EX50AFFIN"))
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

//PAGE AUTHORIZATION

const authPageMerchant = (req, res) => {
  if (req.user.userType !== "EX10AF")
    return res.status(400).json({ msg: "invalid login" });
  res.json({ code: 200, auth: true });
};
const authPageAffiliate = (req, res) => {
  if (req.user.userType !== "EX20AF")
    return res.status(400).json({ msg: "invalid login" });
  res.json({ code: 200, auth: true });
};
const authPagePartner = (req, res) => {
  if (req.user.userType !== "EX50AF")
    return res.status(400).json({ msg: "invalid login" });
  res.json({ code: 200, auth: true });
};
const authPageSpringBoard = (req, res) => {
  if (req.user.userType !== "EXSBAF")
    return res.status(400).json({ msg: "invalid login" });
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

module.exports = {
  initialize: passport.initialize(),
  signUp,
  signUpAffiliates,
  signUpPartner,
  signUpRefCode,
  setUpSpringBoard,
  setUpAdmin,
  signIn: passport.authenticate("local", { session: false}),
  requireJWT: passport.authenticate("jwt", { session: false }),
  signJWTForUser,
  signJWTForAffiliates,
  signJWTForPartners,
  signJWTForSpringBoard,
  authPageAffiliate,
  authPageMerchant,
  authPagePartner,
  authPageSpringBoard,
};
