const Partners = require('../../models/Partners')

// update Partner approval
const updatePartner = async (req, res) => {
  const taxPartner = new Partners ({
    isApproved: req.body.isApproved
  });
  try {
    const partner = await Partners.updateOne({_id: req.parmas.id}, taxPartner);
    res.status(202).json({
      message: 'Partner record updated successfully!',
      result: partner
    });
  } catch (e) {
    res.status(400).json({
      message: 'Oops! Something went wrong!',
      errorMessage: e
    });
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
