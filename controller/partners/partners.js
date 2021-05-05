const Partners = require("./../../models/Partners");
const Tax = require("./../../models/tax");
const CheckName = require("./../../models/Checkname");
const BusinessReg = require("./../../models/businessreg");

const myProfile = async (req, res) => {
  const { email } = req.user;
  //  console.log(email)
  const profile = await Partners.findOne({ email: email });
  const user = {
    name: profile.fullname.split(" ")[0],
    partnerCode: profile.partnerCode,
    regStatus: profile.regStatus.isApproved,
    accountDetails: profile.accountDetails,
  };

  res.json({ user });
};

const myBankUpdate = async (req, res) => {
  const { email } = req.user;
  //  console.log(email)
  const { bank, accountNo, accountName, paymentMode } = req.body;

  const profile = await Partners.findOne({ email: email });
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
};

const getTaxApplicants = async (req, res) => {
  const { email } = req.user;
  //  console.log(email)

  const tax = await Tax.find();
  res.json({ code: 201, tax: tax });
};

const getCheckNameApplicants = async (req, res) => {
  const { email } = req.user;
  //  console.log(email)
  const reservations = await CheckName.find();
  res.json({ code: 201, reservations: reservations });
};
const approvedReservation = async (req, res) => {
  const { email } = req.user;
  const { id, update ,status} = req.body;
   console.log(status)
  const reservations = await CheckName.findOne({ _id: id });
  if(status==="Not Available"){
    reservations.mostPreferred.status = false;
    reservations.morePreferred.status = false;
  }else{
    reservations.mostPreferred = update.mostPreferred;
    reservations.morePreferred = update.morePreferred;
  }
  reservations.markModified("mostPreferred");
  reservations.markModified("morePreferred");
  // reservations.mostPreferred = update.mostPreferred;
  // reservations.morePreferred = update.morePreferred;
  reservations.status = status;
  const updated = await reservations.save();
  res.json({ code: 201, reservations: updated });
};
const getBusinessNameApplicants = async (req, res) => {
  const { email } = req.user;
  //  console.log(email)
  const businessNames = await BusinessReg.find();
  res.json({ code: 201, businessNames: businessNames });
};

module.exports = {
  myProfile,
  myBankUpdate,
  getTaxApplicants,
  getCheckNameApplicants,
  getBusinessNameApplicants,
  approvedReservation
};
