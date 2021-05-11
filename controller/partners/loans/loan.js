const Loan = require('./../../../models/loan')


const getAccountAppChannelle = async (req, res) => {
//   const { email } = req.user;
  //  console.log(email)
  const profile = await Loan.find({ fundingPartner: "CHANNELLE" });
  if(profile){
      return res.json({acct:profile})
  }
  return res.json({acct:null})
};


module.exports = {
  getAccountAppChannelle,
  
};
