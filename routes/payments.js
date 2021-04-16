const express = require('express')
const { requireJWT } = require('../middleware/auth')
const {todaysDate,addMonth,addYear} = require('./../helper/date/date')
const router = express.Router()
const Payments = require('../models/Payments')
const Profiles = require('../models/Profiles')




//add product

router.post('/app/payment/paystack/marketplace', requireJWT, async (req,res)=>{
    const {ref,amount,package,cycle} = req.body
    //
    const {email} = req.user

    const profile = await Profiles.findOne({email:email});

    const handleExpire = ()=>{
        switch (cycle) {
            case 'monthly':
                return addMonth(1)
            case 'yearly':
                return addYear(1)
            default:
                break;
        }
    }
    if(package==='Gold'){
        profile.subscriptionLevel=3;
        profile.subscriptionStart=todaysDate();
        profile.subscriptionEnd = handleExpire()
        profile.save()
    }
    if(package==='Silver'){
        profile.subscriptionLevel=2;
        profile.subscriptionStart=todaysDate();
        profile.subscriptionEnd = handleExpire()
        profile.save()
    }
    if(package==='Bronze'){
        profile.subscriptionLevel=1;
        profile.subscriptionStart=todaysDate();
        profile.subscriptionEnd = handleExpire()
        profile.save()
    }
    // const storeInfo=profile.storeInfo
    if (profile.referral.isReffered && profile.referral.count===1){
        const item = {ref,amount,package,cycle,email:email,service:'marketplace'}
        const newPayment = new Payments(item)
        newPayment.save()
        res.json({code:201, msg:"payment added"})

    } else if(!profile.referral.isReffered && profile.referral.count===0){
        const item = {ref,amount,package,cycle,email:email,service:'marketplace'}
        const newPayment = new Payments(item)
        newPayment.save()
        res.json({code:201, msg:"payment added"})
    } else if(profile.referral.isReffered && profile.referral.count===0){
        const findRef = await Profiles.findOne({referral})
        if(!findRef.refCode){
            res.status(404).json({error:"referral code doesn''t exist"})
        } else {
              //push the user the referrers profile list

        let newReferrer =    {
            amount:amount,
            email:email,
            package:package,
            cycle:cycle,
            commission:0.15*amount
          }
        findRef.earnings.push(newReferrer)
        findRef.markModified('earnings')
        findRef.save()

        const item = {ref,amount,package,cycle,email:email,service:'marketplace'}
        const newPayment = new Payments(item)
        newPayment.save()
        res.json({code:201, msg:"payment added"})
        }
    }


})


router.get('/app/payment/paystack/get-marketplace-payments',requireJWT, async (req,res)=>{
    const {userType}=req.user;

    const pays = await Payments.find()
})

module.exports = router