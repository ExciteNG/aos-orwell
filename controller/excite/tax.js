
const Tax = require('./../../models/tax')


const getAllTax = async (req,res)=>{
    try {
        const nameReserve = await Tax.find().populate(
          {
            path:'assignedTo',
            select:'company'
        });
        res.status(200).json({applications: nameReserve})
      } catch (e) {
        res.status(400).json({message: 'Oops! Something went wrong!'})
      }
}
const getAllLIRS = async (req,res)=>{
    try {
        const nameReserve = await Tax.find({category:"LIRS"}).populate(
          {
            path:'assignedTo',
            select:'company'
        });
        res.status(200).json({applications: nameReserve})
      } catch (e) {
        res.status(400).json({message: 'Oops! Something went wrong!'})
      }
}
const getAllFIRS = async (req,res)=>{
    try {
        const nameReserve = await Tax.find({category:"FIRS"}).populate(
          {
            path:'assignedTo',
            select:'company'
        });
        res.status(200).json({applications: nameReserve})
      } catch (e) {
        res.status(400).json({message: 'Oops! Something went wrong!'})
      }
}
// assign businename check to partner
const assignTaxToParnter = async (req, res) => {
  try {
    const { applicationId, partnerId } = req.body;
    const application = await Tax.findOne({ _id: applicationId });
    application.assignedTo = partnerId;
    application.isAssigned=true;
    application.save();
    return res.json({code:201, message: "Application has been assigned" });
  } catch (error) {
    return res.json({ message: "error" });
  }
};


module.exports = {
    getAllTax,
    assignTaxToParnter,
    getAllFIRS,
    getAllLIRS
}
