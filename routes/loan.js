/* eslint-disable no-unused-vars */
//import the twillo library
const API_KEY=process.env.API_KEY
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio =require('twilio')(accountSid, authToken)
var authy = require('authy')(API_KEY);
const router = require('express').Router();
const Loans = require('../models/loan');
const multer = require('multer');
const randn = Math.floor(10000000*Math.random())


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
        await Loans.create(req.body)
        const welcomeMessage = `customer, Your verification code is ${randn}`
        sendSms(req.body.MobileNumber,welcomeMessage);
        return res.status(200).json({success:"An otp has been sent to the phone number provided, kindly use the code to complete your loan application"})
    } catch (err){
        console.error(err)
        res.status(500).send({error:err.message})
    }
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