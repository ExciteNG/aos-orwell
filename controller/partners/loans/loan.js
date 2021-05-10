const Loan = require('./../../../models/loan')


const getAccountAppChannelle = async (req, res) => {
  const { email } = req.user;
  //  console.log(email)
  const profile = await Loan.findOne({ fundingPartner: "CHANNELLE" });
  const user = {
    name: profile.fullname.split(" ")[0],
    partnerCode: profile.partnerCode,
    regStatus: profile.regStatus.isApproved,
    accountDetails: profile.accountDetails,
  };

  res.json({ user });
};


module.exports = {
  getAccountAppChannelle,
  
};
