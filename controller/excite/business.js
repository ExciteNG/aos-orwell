const CheckNames = require('./../../models/Checkname')
const BusinessReg = require('./../../models/businessreg')
const Partners = require('./../../models/Partners')


const getAllNameReservations = async (req,res)=>{
    try {
        const nameReserve = await CheckNames.find().populate(
          {
            path:'assignedTo',
            select:'company'
        });
        res.status(200).json({applications: nameReserve})
      } catch (e) {
        res.status(400).json({message: 'Oops! Something went wrong!'})
      }
}

const getAllBusinessNameRegistrations =async (req,res)=>{
    try {
        const nameRegister = await BusinessReg.find().populate(
          {
            path:'assignedTo',
            select:'company'
        });
        res.status(200).json({message: nameRegister})
      } catch (e) {
        res.status(400).json({message: 'Oops! Something went wrong!'})
      }
}
// assign businename check to partner
const assignNameToParnter = async (req, res) => {
  try {
    const { applicationId, partnerId } = req.body;
    const application = await CheckNames.findOne({ _id: applicationId });
    application.assignedTo = partnerId;
    application.isAssigned=true;
    application.save();
    return res.json({code:201, message: "Application has been assigned" });
  } catch (error) {
    return res.json({ message: "error" });
  }
};
// assign businename registration to partner
const assignBusinessNameToParnter = async (req, res) => {
  try {
    const { applicationId, partnerId } = req.body;
    const application = await BusinessReg.findOne({ _id: applicationId });
    application.assignedTo = partnerId;
    application.isAssigned=true;
    application.save();
    return res.json({code:201, message: "Application has been assigned" });
  } catch (error) {
    return res.json({ message: "error" });
  }
};

module.exports = {
    getAllNameReservations,
    getAllBusinessNameRegistrations,
    assignNameToParnter,
    assignBusinessNameToParnter
}
