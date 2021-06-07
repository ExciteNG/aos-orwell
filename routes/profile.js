const express = require("express");
const { requireJWT } = require("../middleware/auth");
const { requireJWTCookie } = require("../middleware/cookieAuth");
const Randomstring = require("randomstring");
const router = express.Router();
const Profiles = require("../models/Profiles");
const affiliateAccept = require("../emails/affiliate_success");
const affiliateDecline = require("../emails/affiliate_decline");
var nodeoutlook = require("nodejs-nodemailer-outlook");
const affiliateSuccess = require("../emails/affiliate_success");

// my affiliate profile
router.get("/app/profile/get-my-profile", requireJWT, async (req, res) => {
  const { email, userType } = req.user;
  console.log(userType);
  if (userType !== "EX20AF")
    return res.status(401).json({ message: "Unauthorized" });
  const profile = await Profiles.findOne({ email: email });

  res.json(profile);
});

// affiliate update bank information
router.put(
  "/app/profile/get-my-profile/bank-update",
  requireJWT,
  async (req, res) => {
    const { bank, accountNo, accountName, paymentMode } = req.body;
    const { email, userType } = req.user;
    console.log(userType);
    if (userType !== "EX20AF")
      return res.json({ code: 401, message: "Unauthorized" });
    const profile = await Profiles.findOne({ email: email });

    profile.accountDetails = {
      bank: bank,
      accountName: accountName,
      accountNo: accountNo,
      paymentMode: paymentMode,
      bvn: "",
      branch: "",
    };
    profile.markModified("accountDetails");
    profile.save();

    res.json(profile);
  }
);
// affilites update profile

router.put(
  "/app/profile-self-upgrade/affiliate",
  requireJWT,
  async (req, res) => {
    //do something
    const { email, userType } = req.user;
    if (userType !== "EX20AF")
      return res.json({ code: 401, message: "Unauthorized" });
    const profile = await Profiles.findOne({ email: email });
    profile.identification = {
      id: req.body.id,
      idType: req.body.idType,
      passport: req.body.passport,
    };
    profile.fullname = req.body.fullname;
    profile.phone = req.body.phone;
    profile.markModified("identification");
    profile.markModified("fullname");
    profile.markModified("phone");
    profile.save();
  }
);

//springboard access to affiliates
router.get(
  "/app/profile/get-all-affiliates/profile",
  requireJWT,
  async (req, res) => {
    try {
      const { email, userType } = req.user;
      if (userType !== "EXSBAF")
        return res.status(401).json({ message: "Unauthorized" });

      const affiliates = await Profiles.find({ userType: "EX20AF" });

      res.json({ code: 201, affiliates });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

//springborad access to an affiliate
router.post("/app/profile/get/profile", async (req, res) => {
  const { profile } = req.body;
  // const {email,userType} = req.user
  // if(userType !== "EXSBAF") return res.status(401).json({message:'Unauthorized'})

  //
  Profiles.findOne({ _id: profile }, (err, doc) => {
    // console.log(doc)
    res.json(doc);
  });
});

// springboard approved status for affiliate
router.put("/app/profile/get/profile/approved", async (req, res) => {
  const { profile, state } = req.body;
  // const {email,userType} = req.user
  // if(userType !== "EXSBAF") return res.status(401).json({message:'Unauthorized'})
  const generateRefNo = Randomstring.generate({
    length: 6,
    charset: "alphanumeric",
    readable: true,
  });
  //
  let affiliate = await Profiles.findOne({ _id: profile });
  if (state === "Accept") {
    affiliate.regStatus.isApproved = true;
    affiliate.regStatus.dateApproved = new Date().toLocaleDateString();
    affiliate.affiliateCode = `AF${generateRefNo}`;
    affiliate.markModified("regStatus");
    affiliate.save();

    //send acceptance email
    nodeoutlook.sendEmail({
      auth: {
        user: process.env.EXCITE_ENQUIRY_USER,
        pass: process.env.EXCITE_ENQUIRY_PASS,
      },
      from: process.env.EXCITE_ENQUIRY_USER,
      to: affiliate.email,
      subject: "NOTIFICATION ON AFFILIATE APPLICATION",
      html: affiliateSuccess(),
      text: affiliateSuccess(),
      replyTo: "enquiry@exciteafrica.com",
      onError: (e) => console.log(e),
      onSuccess: (i) => console.log(i),
      secure: false,
    });
    return res.json({ code: 201, affiliate });
  }
  if (state === "Decline") {
    affiliate.regStatus.isApproved = false;
    affiliate.regStatus.dateApproved = "";
    affiliate.affiliateCode = `AF${generateRefNo}`;
    affiliate.markModified("regStatus");
    affiliate.save();
    //send rejection email

    nodeoutlook.sendEmail({
      auth: {
        user: process.env.EXCITE_ENQUIRY_USER,
        pass: process.env.EXCITE_ENQUIRY_PASS,
      },
      from: process.env.EXCITE_ENQUIRY_USER,
      to: affiliate.email,
      subject: "NOTIFICATION ON AFFILIATE APPLICATION",
      html: affiliateDecline(),
      text: affiliateDecline(),
      replyTo: "enquiry@exciteafrica.com",
      onError: (e) => console.log(e),
      onSuccess: (i) => console.log(i),
      secure: false,
    });

    return res.json({ code: 201, affiliate });
  }
});

// Merchants Profile by email
router.get("/app/profile/get/profile/email", requireJWT, async (req, res) => {
  const { email, userType } = req.user;
  console.log(email)
  //
  try {
    const profile =await Profiles.findOne({ email: email });
    // console.log(profile)
    if (profile) {
        // console.log('hello')
      return res.json(profile);
    }
  } catch (error) {
      console.log(error)
    return res.status(400).json({ err: error });
  }
});
// Merchants name by email
router.get(
  "/app/profile/get/profile/email/name",
  requireJWT,
  async (req, res) => {
    const { profile } = req.body;
    const { email, userType } = req.user;
    //
    Profiles.findOne({ email: email }, (err, doc) => {
      // console.log(doc)
      res.json({ fullname: doc.fullname });
    });
  }
);

module.exports = router;
