const CheckNames = require('./../../models/Checkname')
const BusinessReg = require('./../../models/businessreg')




const getAllNameReservations = async (req,res)=>{
    try {
        const nameReserve = await CheckNames.find();
        res.status(200).json({message: nameReserve})
      } catch (e) {
        res.status(400).json({message: 'Oops! Something went wrong!'})
      }
}

const getAllBusinessNameRegistrations =async (req,res)=>{
    try {
        const nameRegister = await BusinessReg.find();
        res.status(200).json({message: nameRegister})
      } catch (e) {
        res.status(400).json({message: 'Oops! Something went wrong!'})
      }
}



module.exports = {
    getAllNameReservations,
    getAllBusinessNameRegistrations
}