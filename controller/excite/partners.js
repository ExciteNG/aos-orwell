const Partners = require('../../models/Partners')





const getAllPartners = async (req,res)=>{
    try {
        const allBizProfiles = await Partners.find();
        res.status(200).json({message: allBizProfiles})
      } catch (e) {
        res.status(400).json({message: 'Oops! Something went wrong!'})
      }
}

const getAllBusinessPartners = async (req,res)=>{
  try {
    const allBizProfiles = await Partners.find({userType:"EX50AFBIZ"})
    res.status(200).json({message: allBizProfiles})
  } catch (e) {
    res.status(400).json({message: 'Oops! Something went wrong!'})
  }
}
const getAllTaxPartners = async (req,res)=>{
  try {
    const allBizProfiles = await Partners.find({userType:"EX50AFTAX"})
    res.status(200).json({message: allBizProfiles})
  } catch (e) {
    res.status(400).json({message: 'Oops! Something went wrong!'})
  }
}


module.exports = {
    getAllPartners,
    getAllTaxPartners,
    getAllBusinessPartners
}