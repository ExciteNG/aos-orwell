const ReceivablesModel = require('../models/receivablesBook');
const Profiles = require('./../models/Profiles');
var nodeoutlook = require("nodejs-nodemailer-outlook");
const invoiceMail = require('../emails/invoice_mail')

const createRecord = async (req, res) => {
  console.log('req body ', req.body);
  const {email, userType} = req.user;
  const profiles = await Profiles.findOne({email:email});
  const storeInfo = profiles.storeInfo;
  // console.log('receivables thisSales', thisSales);
    try {
        // req.body.user = req.user.id
        if (req.body.quantity === null){
          req.body.quantity = 1;
          req.body.total = req.body.price;
        }
3
        // req.body.qtySum = 1 * req.body.price;
        const thisSales=req.body;
        // const data= {
        //   productName:req.body.productName,
        //   productID:req.body._id,
        // }
        const refSales = thisSales._id;
       delete thisSales._id
       // console.log(thisSales)
        await ReceivablesModel.create({
          ...thisSales,
          storeInfo:storeInfo,
          email,
          salesRef:refSales
        })

        //send invoice mail if email is present
        if (thisSales.buyersEmail){
          //sendmail
          nodeoutlook.sendEmail({
            auth: {
              user: process.env.EXCITE_ENQUIRY_USER,
              pass: process.env.EXCITE_ENQUIRY_PASS,
            },
            from: "enquiry@exciteafrica.com",
            to: thisSales.buyersEmail,
            subject: `INVOICE FOR ${thisSales.productName}`,
            html: invoiceMail(thisSales.productName, thisSales.price, thisSales.quantity, thisSales.total),
            text: invoiceMail(thisSales.productName, thisSales.price, thisSales.quantity, thisSales.total),
            replyTo: "enquiry@exciteafrica.com",
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i),
            secure: false,
          });
        } else{
          console.log('invoice generated successfully')
        }
        return res.send({code:201,message:"success"})
    } catch (err) {
        console.error(err)
        res.send({status:500, message:err.message})
    }
}

const updateRecord = async (req, res) => {
  const id = req.params.id
  try {
    let record = await ReceivablesModel.findById({_id:id})
    // let record = await ReceivablesModel.findById({_id:id}).lean()/
    if (!record){
      res.json({status:404,message:"not found"})
    }
    else {
        let {productName, price, buyersContact, description, qtySold, totalPaid, sumTotalPaid} = req.body
        record = await ReceivablesModel.findByIdAndUpdate({_id:id}, req.body,{
            new: true
        })
     }
    return res.json({ status:200, update:record})
  }
  catch (err) {
      console.error(err)
     return res.send({status:500, error: err.message})
  }
}

const getOneRecord = async (req, res) => {
  const id = req.params.id
  try {
      const storeId = await ReceivablesModel.findById({_id:id})
      if (!storeId){
          return res.send({status:404,message:"not found"})
      }
      return res.status(200).json({record:storeId})

  } catch (err) {
      console.error(err)
      res.json({status:500,error:err.message})
  }
}

const getAllRecords = async (req, res) => {
  const {email,userType} = req.user

  try {
    const records =  await ReceivablesModel.find({email:email}).sort({createdAt: 'asc' }).lean()
    return res.status(200).json({"records": records})
  }
  catch (err){
    console.error(err)
    return res.json({status:500,"error": err.message})
  }
}

const deleteOneRecord = async (req, res) => {
  const id = req.params.id

  try {
    let record = await ReceivablesModel.findById({_id:id}).lean()

    if (!record) {
      return res.send({status:404,message:"not found"})
    } else {
      await ReceivablesModel.deleteOne({_id:id})
      return  res.status(200).send({message:"Delete successful !"})
    }
  } catch (err) {
    console.error(err)
    return res.send({status:500, error:err.message})
  }
}

const deleteAllRecords = async (req, res) => {
  const id = req.params.id

  try {
    let record = await ReceivablesModel.find().lean()
    if (record.length===0) {
      return res.send({status:404,message:"records not found"})
    } else {
    await ReceivablesModel.deleteMany()
    return  res.status(200).send({message:"Wipedown complete and successful !"})
  }
  } catch (err) {
      console.error(err)
      return res.send({status:500,error:err.message})
  }
}

module.exports = {
  createRecord,
  updateRecord,
  getOneRecord,
  getAllRecords,
  deleteOneRecord,
  deleteAllRecords
}
