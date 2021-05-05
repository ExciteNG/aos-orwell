const Partners = require('../../models/Partners')

// update Partner approval
const updatePartner = async (req, res) => {
  try {
    const partner = await Partners.findOne({_id:req.params.id});
    const regStatus = partner.regStatus;
    regStatus.isApproved=req.body.isApproved;
    regStatus.dateApproved = new Date().toDateString();
    partner.regStatus=regStatus;
    partner.markModified("regStatus");
    await partner.save()
    return res.json({message:"updated successful"})
  } catch (e) {
    res.json({
      message: 'Something went wrong!',
      errorMessage: e
    })
  }
}

// get all partners
const getAllPartners = async (req,res)=>{
  try {
      const allBizProfiles = await Partners.find();
      res.status(200).json({message: allBizProfiles})
    } catch (e) {
      res.status(400).json({
        message: 'Oops! Something went wrong!',
        errorMessage: e
      })
    }
}

// get all business partners
const getAllBusinessPartners = async (req,res)=>{
  try {
    const allBizProfiles = await Partners.find({userType:"EX50AFBIZ"})
    res.status(200).json({message: allBizProfiles})
  } catch (e) {
    res.status(400).json({
      message: 'Oops! Something went wrong!',
      errorMessage: e
    });
  }
}

// get all tax partners
const getAllTaxPartners = async (req,res)=>{
  try {
    const allBizProfiles = await Partners.find({userType:"EX50AFTAX"})
    res.status(200).json({message: allBizProfiles})
  } catch (e) {
    res.status(400).json({
      message: 'Oops! Something went wrong!',
      errorMessage: e
    })
  }
}

module.exports = {
  updatePartner,
  getAllPartners,
  getAllTaxPartners,
  getAllBusinessPartners
}
