/* eslint-disable no-unused-vars */
//import the twillo library
const API_KEY=process.env.API_KEY
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio =require('twilio')(accountSid, authToken);
const smsKey=process.env.SMS_SECRET_KEY;
var authy = require('authy')(API_KEY);
const router = require('express').Router();
const Loans = require('../models/loan');
const multer = require('multer');
const crypto = require('crypto');
const otp = Math.floor(10000000*Math.random())


router.delete('/delete/:id', async (req,res) => {

    const id = req.params.id
    
    try {
        let loans = await Loans.findById({_id:id}).lean()
  
        if (!loans) {
          return res.status(404).send({message:"loan details not found"})
        } else {
        await Loans.deleteOne({_id:id})
       return  res.status(200).send({message:"loan application successfully deleted !"})
          }
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({error:err.message}) 
    }
})

router.get('/all', async (req,res)=>{
    try {
        let loans = await Loans.find({}).lean().sort({createdAt:-1})
        if (loans.length === 0) return res.status(404).json({empty:"You have no loan records"})
        return res.status(200).json({loans:loans})
    } catch (err) {
        console.error(err)
        res.status(500).send({error:err.message})
    }
})

router.post('/new',async (req,res)=>{
    try {
        const phone=req.body.MobileNumber;
        await Loans.create(req.body)
        //set an expiry timeline 2 mins for starters
        const expires = Date.now() + 2*60*1000
        const welcomeMessage = `Dear customer, Your verification code is ${otp}`

    //     const data = `${phone}.${otp}.${expires}`;
	// const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
	// const fullHash = `${hash}.${expires}`;

         const data = `${phone}.${otp}.${expires}`;
        //create a HMAC to authenticate the otps
        const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
        console.log(hash)
        const fullHash = `${hash}.${expires}`;
       // sendSms(phone,welcomeMessage);
        return res.status(200).json({phone, hash: fullHash, otp,success:"An otp has been sent to the phone number provided, kindly use the code to complete your loan application"})
    } catch (err){
        console.error(err)
        res.status(500).send({error:err.message})
    }
})

//verify the user's otp
router.post('/new/user', async (req,res)=>{
    const phone = req.body.MobileNumber;
	const hash = req.body.hash;
	const otp = req.body.otp;
    console.log(hash)
     let [ hashValue, expires ] = hash.split('.');
    console.log(hashValue)

	let now = Date.now();
	if (now > parseInt(expires)) {
		return res.status(504).send({ msg: 'Timeout. Please try again' });
	}
	data = `${phone}.${otp}.${expires}`;
	let newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
    console.log(newCalculatedHash)

    if (hashValue) {
		console.log('user confirmed');
        let Loan =await Loans.findOne({
            verified: false,
          });
        Loan.verified=true
        Loan.markModified("verified")
        Loan.save()
        res.status(200).send({"success":"verified successfully"});
    }else{
        console.log('auth error');
        res.status(500).send({"error":"invalid otp credential,regenerate another token and try again"});
    }
    // if (otp) {
    //     res.status(200).send({"success":"account verified successfully !"})
    // }else {
    //     res.status(400).send({"error":"incorrect otp,regenerate another token and try again"})
    // }
})

//create a twillio helper function to send sms
const sendSms = (phone, message) => {
    try {
        let msg = twilio.messages
        .create({
           body: message,
           from: process.env.TWILIO_PHONE_NUMBER,
           to: phone
         })
         console.log(msg.sid);
         return msg
    } catch (err) {
        console.error(err)
    }
  }
  

module.exports = router