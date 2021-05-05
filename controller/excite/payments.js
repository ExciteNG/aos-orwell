const Payments = require('../../models/Payments')

const getAllPayments = async (req,res)=>{
  try {
      const allPayments = await Payments.find();
      res.status(200).json({message: allPayments})
    }
  catch (e) {
    res.status(400).json({
      error: e,
      message: 'Oops! Something went wrong!'
    })
  }
}

module.exports = {
  getAllPayments
}
