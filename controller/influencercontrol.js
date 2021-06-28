// required imports: controller modules, influencer models,merchant innfluencer models,merchant models 
const influencerMerchantModel = require('../models/merchantinfluencer');
const nodeoutlook = require('nodejs-nodemailer-outlook');
const Influencer = require('../models/influencer');
const bargainModel = require('../models/bargain');
const influencerNotification = require('../emails/influencer_engagement')
const Profiles = require('../models/Profiles')
const agreePrice = require('../models/agreeprice');
const Negotiation = require('../models/infMerchantNegotiate');
const { get } = require('mongoose');

//todo access control vulnerabilities

//create an influencer function to assert the level  of an influencer by numbers numerically
// const getLevel = (level,posts) => {
//     switch (level) {
//         case 'micro':
//             let range = [10000,50000];
//             let pricing =  [2.4*10000*posts, 4.4*50000*posts]
//             break;
            
//         case 'mini':
//             let range = [50001,500000];
//             let pricing =  [2.4*50001*posts, 4.4*500000*posts]
//             break;
        
//         case 'maxi':
//             let range = 500000
//             let pricing =  [2.4*50001*posts, 4.4*500000*posts]
//             break;
//         default:
//             let range = [10000,50000];
//             break;
//     }
// }

const getPricingRange = (Reach,posts,months) => {
    return [2.2*Reach*posts*months, 4.2*Reach*posts*months]
}

const unitPricingRange = (Reach) => {
    return [2.2*Reach,4.2*Reach]
}

const MerchantPickInfluencer = async (req,res) => {
    try {
        // const {email,userType} = req.user;
        let {
            email,
            userType,
            productName,
            ReasonForProm,
            uniqueQualities,
            permanentPosts,
            contactPreference,
            modeOfContact,
            mediaPlacement,
            influencerLevel,
            productUsers,
            reach,
            productPrice,
            competitors,
            productServiceCategory,
            contentCreator,
            noOfPosts,
            unitPost,
            durationOfPromotion,
            unitMonth,
            crossPlatformPromotion,
            deliverable,
            deliveryType,
            coverage,
            pricing,
            unitPricing
        } = req.body
        // req.body.email = email
        // req.body.userType = userType
        //verify that the user is a merchant
        if (req.user.userType !== "EX10AF") return res.json({code:401,message:"You must be a merchant to access this resource"})
        //get the influencer level (could be one of micro,mini,max)
        // const getInfluencerLevel = influencerLevel.replaceAll(" ","").split("")[0].toLowerCase()
        // console.log(getInfluencerLevel)
        pricing = getPricingRange(reach,noOfPosts,durationOfPromotion)
        unitPricing = unitPricingRange(reach)
        let newMerchantInfluencer = new influencerMerchantModel({...req.body,pricing,unitPricing})
        newMerchantInfluencer.markModified("pricing")
        newMerchantInfluencer.markModified("unitPricing")
        // influencerMerchantModel.markModified("pricing")
        // influencerMerchantModel.markModified("unitPricing")
        await newMerchantInfluencer.save()
        //filter only the approved influencers
    //    const approvedInfs = Influencer.find({regStatus:"accepted"})
        const matchedInfluencers = await Influencer.find({$or:[{marketingSpecialty:productServiceCategory},
            {influencerLevel:influencerLevel}]}) 
        //find an influencer based on these parameters
        if (matchedInfluencers.length === 0) return res.json({code:200,data:"no matches for your budget",
        prices:[pricing,unitPricing]})
        return res.json({code:200,data:matchedInfluencers,prices:[pricing,unitPricing]})
    } catch (err) {
           console.error(err)
        return res.json({code:500,message:err.message})
    }
} 


//pick a specific influencer for negotiation
const influencerNegotiation = async (req,res) => {
    try {
        // const {email} = req.user
        const id = req.params.id
        //filter only the approved influencers
        // const approvedInfluencers = Infuencer.find({regStatus:"accepted"})
        // let profile = await Profiles.find({email:email})
        // if (!profile) return res.json({code:404,message:"Not user profile with that email was found"})
        const getInfluencer =  await Influencer.findById(id).lean()
        if (!getInfluencer) return res.json({code:404,message:"no user with that identifier"})

        //increase the merchant campaign

        // profile.influencers.push({influencerName:getInfluencer.fullName,status:"pending"})
        // profile.pendingCampaigns = profile.pendingCampaigns + 1
        let pending = getInfluencer.pendingJobs
        let newpending = pending + 1
        console.log(newpending)
        // await profile.save()
        await Influencer.findOneAndUpdate({_id:id},{pendingJobs:newpending},{new:true,runValidators:true},
            function (err,docs){
                if (err) console.error(err)
                console.log(docs) 
            })
        // getInfluencer.pendingJobs = await getInfluencer.pendingJobs + 1
        // await getInfluencer.markModified("pendingJobs")
        let firstName = getInfluencer.fullName.split(' ')[0]
        // let newClient = {profile.storeInfo, profile.fullname, profile.phone}
        // getInfluencer.exciteClients.push(newClient)
        // getInfluencer.markModified("exciteClients")
        // await getInfluencer.save()
        // nodeoutlook.sendEmail({
        //     auth: {
        //       user: process.env.EXCITE_ENQUIRY_USER,
        //       pass: process.env.EXCITE_ENQUIRY_PASS,
        //     },
        //       from: 'enquiry@exciteafrica.com',
        //       to: getInfluencer.email,
        //       subject: 'EXCITE INFLUENCER MARKETING ENGAGEMENT NOTIFICATION',
        //       html: influencerNotification(firstName,profile.fullName,id),
        //       text: influencerNotification(firstName,profile.fullName,id),
        //       replyTo: 'enquiry@exciteafrica.com',
        //       onError: (e) => console.log(e),
        //       onSuccess: (i) => {
        //       // return res.json({code:200,message: 'Reset mail has been sent',userType:user.userType});
        //       console.log(i)
        //       },
        //       secure:false,
        //   })
        //   await getInfluencer.save((err,docs)=>{
        //       console.log(err)
        //   })
        return res.json({code:200,data:getInfluencer,message:"an email has been sent to the influencer you just selected,expect to hear from him/her soon !",
        })
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}

// POST metric influencer fill form
// GET influencer dashboard view
const getInfluencerDashboard = async (req,res) => {
    try {
        const id = req.params.id
        const singleInfluencer = await Influencer.findById(id).lean()
        if (singleInfluencer.regStatus === 'pending'){
            return res.json({code:404,message:"No data yet, awaiting approval",data:singleInfluencer})
        } 
        return res.json({code:200,data:singleInfluencer})
        
    } catch (err) {
        console.error(err)
        return res.json({code:200,message:err.message})
    }
}
// GET weekly reports
// PAYMENT POPUP VIEW 
//BARGAIN POP UP VIEW

//POST SEND MESSAGE EITHER AS AN INFLUENCER OR MERCHANT
// const bargainSendInfluencer = async (req,res) => {
//     try {
//         const {email} = req.user
//         req.body.sender = email
//     const newBargainChat = new bargainModel(req.body)
//     await newBargainChat.save()
//     return res.json({code:200,data:newBargainChat})
//     } catch (err) {
//         console.error(err)
//         return res.json({code:500,message:err.message})
//     }
// }

//GET recieved messages tailored to the merchant or influencer
// const bargainSendMerchant = (req,res) => {
//     try {
//         const {email} = req.user
//         const filterReceivedMessages = bargainModel.find({receiver:email}).lean().sort({'receiver':-1});
//         return res.json({code:200,data:filterReceivedMessages})
//     } catch (err) {
//         console.error(err)
//         return res.json({code:500,message:err.message})
//     }
// }

//merchant dashboard
const merchantDashboard = async (req,res) => {
    try {
        const id = req.params.id
        let profile = Profiles.findById(id).lean()
        //filter the list of influencers to the one with the same id
        let influencerData = {...profile.ongoingCampaigns,...profile.pendingCampaigns,...profile.influencer}
        return res.json({code:200,data:influencerData})
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }


}
// influencer accept offer /agree route
const influencerAgreePrice = async (req,res) => {
    try {
        // const {email,userType} = req.user
        if (req.body.userType !== "EX10AF") return res.json({code:401,message:"You are not authorized to view this resource"})
        // req.body.email = email
        // req.body.userType = userType
        // req.body.createdAt = new Date().toString()
        const newPrice = new agreePrice(req.body)
        //send to paystack
        await newPrice.save()
        //send mail
        return res.json({code:200,data:newPrice})
        
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}

//influencer accept button
//influencer negotiate price
const influencerNegotiatePrice = async (req,res) => {
    try {
        const {email} = req.user

        //find the full name in the merchant database
        let getMerchant = await Profiles.find({fullName:req.body.fullName}).lean()
        if (!getMerchant) return res.json({code:404,message:"Merchant not found !, please check if you entered the merchant fullname properly from the received email address"})
        req.body.influencerEmail = email
        req.body.merchantEmail = getMerchant.email
        let negotiation = new Negotiation(req.body)
        // negotiation.influencerMessages.push(req.body.influencerMessages)
        // await negotiation.markModified("influencerMessages")
        await negotiation.save()

        return res.json({code:201,data:negotiation})
        
    } catch (err) {
        return res.json({code:500,message:err.message})
    }
}

//send message back to influencer
const merchantNegotiateOffer = async (req,res) => {
    try {
        const id = req.params.id
        const {email} = req.user
        //first conditional: send the message to the  right influencer
        if (req.user.userType === "EX20AF"){
        let merchantNegotiationEmail = await Negotiation.findById(id).lean()
        if (!merchantNegotiationEmail) return res.json({code:404,message:"Not found"})
        let newMerchantMessages = merchantNegotiationEmail.merchantMessages
        await Negotiation.findOneAndUpdate({_id:id},{newMerchantMessages:newMerchantMessages.push(req.body.merchantMessages)},
        {new:true,runValidators:true},(err,docs)=>{
            if (err) console.error(err)
            console.log(docs)
        }) 
        return res.json({code:200,data:merchantNegotiationEmail})
        // second conditional: influencer sends message back to merchant
        } else if (req.user.userType === "EX90IF") {
            let influencerNegotiationEmail = await Negotiation.findById(id).lean()
            if (!influencerNegotiationEmail) return res.json({code:404,message:"Not found"})
            let newInfluencerMessages = influencerNegotiationEmail.influencerMessages
            await Negotiation.findOneAndUpdate({_id:id},{newInfluencerMessages:newInfluencerMessages.push(req.body.influencerMessages)},
        {new:true,runValidators:true},(err,docs)=>{
            if (err) console.error(err)
            console.log(docs)
        }) 
        return res.json({code:200,data:influencerNegotiationEmail})
        }
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}
//influencer reject offer
// router.delete()
// const influencerDeclineOffer = (req,res) => {


// }


module.exports = {
    MerchantPickInfluencer,
    influencerNegotiation,
    getInfluencerDashboard,
    merchantDashboard,
    influencerAgreePrice,
    influencerNegotiatePrice,
    merchantNegotiateOffer
}