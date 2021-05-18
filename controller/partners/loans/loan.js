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

const getApplicationInfo = async (req,res)=>{

  const application = await Loan.findById(req.params.application);
  if(application){
   return res.json({code:200,doc:application})
  }
  return res.json({code:404, doc:[]})
}


module.exports = {
  getAccountAppChannelle,
  getApplicationInfo
  
};
