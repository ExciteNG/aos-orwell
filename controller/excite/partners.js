const Partners = require("../../models/Partners");
const rejectPartner = require("./../../emails/partner_decline");
const successPartner = require("./../../emails/partner_success");
const CheckName = require("./../../models/Checkname");
// update Partner approval
const updatePartner = async (req, res) => {
  try {
    const partner = await Partners.findOne({ _id: req.params.id });
    const regStatus = partner.regStatus;
    regStatus.isApproved = req.body.isApproved;
    regStatus.dateApproved = new Date().toDateString();
    partner.regStatus = regStatus;
    partner.markModified("regStatus");
    await partner.save();
    if (req.body.isApproved === "rejected") {
      //send mail
      nodeoutlook.sendEmail({
        auth: {
          user: process.env.EXCITE_ENQUIRY_USER,
          pass: process.env.EXCITE_ENQUIRY_USER,
        },
        from: "enquiry@exciteafrica.com",
        to: user.email,
        subject: "Notification",
        html: rejectPartner(),
        text: rejectPartner(),
        replyTo: "enquiry@exciteafrica.com",
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i),
        secure: false,
      });
    } else {
      //send mail
      nodeoutlook.sendEmail({
        auth: {
          user: process.env.EXCITE_ENQUIRY_USER,
          pass: process.env.EXCITE_ENQUIRY_USER,
        },
        from: "enquiry@exciteafrica.com",
        to: user.email,
        subject: "Notification",
        html: successPartner(),
        text: successPartner(),
        replyTo: "enquiry@exciteafrica.com",
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i),
        secure: false,
      });
    }
    return res.json({ message: "updated successful" });
  } catch (e) {
    res.json({
      message: "Something went wrong!",
      errorMessage: e,
    });
  }
};

// get all partners
const getAllPartners = async (req, res) => {
  try {
    const all = await Partners.find();
    res.status(200).json({ partners: all });
  } catch (e) {
    res.status(400).json({
      message: "Oops! Something went wrong!",
      errorMessage: e,
    });
  }
};

// get all business partners
const getAllBusinessPartners = async (req, res) => {
  try {
    const allBizProfiles = await Partners.find({ userType: "EX50AFBIZ" });
    res.status(200).json({ message: allBizProfiles });
  } catch (e) {
    res.status(400).json({
      message: "Oops! Something went wrong!",
      errorMessage: e,
    });
  }
};

// get all tax partners
const getAllTaxPartners = async (req, res) => {
  try {
    const allBizProfiles = await Partners.find({ userType: "EX50AFTAX" });
    res.status(200).json({ message: allBizProfiles });
  } catch (e) {
    res.status(400).json({
      message: "Oops! Something went wrong!",
      errorMessage: e,
    });
  }
};



module.exports = {
  updatePartner,
  getAllPartners,
  getAllTaxPartners,
  getAllBusinessPartners,

};
