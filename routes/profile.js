const express = require('express')
const { requireJWT } = require('../middleware/auth')
const Randomstring = require('randomstring')
const router = express.Router()
const Profiles = require('../models/Profiles')



// my affiliate profile
router.get('/app/profile/get-my-profile', requireJWT, async (req,res)=>{
    const {email,userType} = req.user
    console.log(userType)
    if(userType !== "EX20AF") return res.status(401).json({message:'Unauthorized'})
    const profile = await Profiles.findOne({email:email})

    res.json(profile)
})

// affiliate update bank information
router.put('/app/profile/get-my-profile/bank-update', requireJWT, async (req,res)=>{
    const {bank,accountNo,accountName,paymentMode} = req.body
    const {email,userType} = req.user
    console.log(userType)
    if(userType !== "EX20AF") return res.status(401).json({message:'Unauthorized'})
    const profile = await Profiles.findOne({email:email});

    profile.accountDetails={bank:bank,accountName:accountName,accountNo:accountNo,paymentMode:paymentMode,bvn:"",branch:""}
    profile.markModified('accountDetails');
    profile.save()

    res.json(profile)
})




//springboard access to affiliates
router.get('/app/profile/get-all-affiliates/profile', requireJWT, async (req,res)=>{
    try {
      const {email,userType} = req.user
      if(userType !== "EXSBAF") return res.status(401).json({message:'Unauthorized'})

      const affiliates = await Profiles.find({userType:'EX20AF'})

      res.json({code:201,affiliates})
    } catch (error) {
      res.status(500).json(error)
    }
})

//springborad access to an affiliate
router.post('/app/profile/get/profile', async (req,res)=>{
    const {profile} = req.body
    // const {email,userType} = req.user
    // if(userType !== "EXSBAF") return res.status(401).json({message:'Unauthorized'})

    //
    Profiles.findOne({_id:profile},(err,doc)=>{
        // console.log(doc)
        res.json(doc)

    })
})

// springboard approved status for affiliate
router.put('/app/profile/get/profile/approved', async (req,res)=>{
    const {profile} = req.body
    // const {email,userType} = req.user
    // if(userType !== "EXSBAF") return res.status(401).json({message:'Unauthorized'})
const generateRefNo = Randomstring.generate({
    length:6,
    charset:'alphanumeric',
    readable:true
})
    //
    let affiliate = await Profiles.findOne({_id:profile})

        affiliate.regStatus.isApproved=true;
        affiliate.regStatus.dateApproved='3/2/2019'
        affiliate.affiliateCode=`AF${generateRefNo}`
        affiliate.markModified('regStatus')
        affiliate.save()
        res.json({code:201,affiliate})

})

// Merchants Profile by email
router.get('/app/profile/get/profile/email',requireJWT, async (req,res)=>{
    const {profile} = req.body
    const {email,userType} = req.user
//
    Profiles.findOne({email:email},(err,doc)=>{
        // console.log(doc)
        res.json(doc)

    })

})
// Merchants name by email
router.get('/app/profile/get/profile/email/name',requireJWT, async (req,res)=>{
    const {profile} = req.body
    const {email,userType} = req.user
//
    Profiles.findOne({email:email},(err,doc)=>{
        // console.log(doc)
        res.json({fullname:doc.fullname})

    })

})

module.exports = router
