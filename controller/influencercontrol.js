// required imports: controller modules, influencer models,merchant innfluencer models,merchant models 
const influencerMerchantModel = require('../models/merchantinfluencer');
const nodeoutlook = require('nodejs-nodemailer-outlook');
const Influencer = require('../models/influencer');
const bargainModel = require('../models/bargain');
const influencerNotification = require('../emails/influencer_engagement');
const Profiles = require('../models/Profiles');
const agreePrice = require('../models/agreeprice');
const Negotiation = require('../models/infMerchantNegotiate');

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

const merchantPickInfluencer = async (req,res) => {
    try {
        const {email,userType} = req.user;
        let {
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
        req.body.email = email
        req.body.userType = userType
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

//following th first request
//pick a specific influencer for negotiation
const influencerNegotiation = async (req,res) => {
    try {
        const {email} = req.user
        const id = req.params.id
        if (req.user.userType !== "EX10AF") return res.json({code:401,message:"You must be a merchant to access this resource"})
        //filter only the approved influencers
        // const approvedInfluencers = Influencer.find({regStatus:"accepted"})
        let profile = await Profiles.find({email:email})
        if (!profile) return res.json({code:404,message:"No user profile with that email was found"})
        const getInfluencer =  await Influencer.findById(id).lean()
        if (!getInfluencer) return res.json({code:404,message:"the influencer was not found !"})
        //increase the merchant campaign
        profile.pendingCampaigns =await profile.pendingCampaigns + 1
        await profile.markModified("pendingCampaigns")
        await profile.save()
        //mark modify profiles
        let pending = getInfluencer.pendingJobs
        let newpending = pending + 1
        console.log(newpending)
        await Influencer.findOneAndUpdate({_id:id},{pendingJobs:newpending},{new:true,runValidators:true},
            function (err,docs){
                if (err) console.error(err)
                console.log(docs) 
            })
        // getInfluencer.pendingJobs = await getInfluencer.pendingJobs + 1
        // await getInfluencer.markModified("pendingJobs")
        let firstName = getInfluencer.fullName.split(' ')[0]
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
        const {email} = req.user
        if (req.user.userType !== "EX90IF") return res.json({code:401,message:"you do not have permissions to view this resource"})
        const singleInfluencer = await Influencer.findOne({email:email})
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
//merchant dashboard
const merchantDashboard = async (req,res) => {
    try {
        const {email} = req.user
        let profile = Profiles.find({email:email}).lean()
        if (req.user.userType !== "EX10AF") return res.json({code:401,message:"you are not allowed to view this resource"})
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
        //pay via paystack
        await newPrice.save()
        //send mail
        return res.json({code:200,data:newPrice})
        
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}

//influencer negotiate price
const influencerNegotiatePrice = async (req,res) => {
    try {
        const {email} = req.user

        //find the email address in the influencer database
        let negotiateInfluencer = await Influencer.find({email:email}).lean()
        //find the full name in the merchant database
        let getMerchant = await Profiles.find({fullName:req.body.fullName}).lean()
        if (!getMerchant) return res.json({code:404,message:"Merchant not found !, please check if you entered the merchant fullname properly from the received email address"})
        req.body.influencerEmail = email
        req.body.merchantEmail = getMerchant.email
        req.body.merchantFullName = req.body.fullName
        req.body.influencerFullName = negotiateInfluencer.fullName
        //check if this particular people has conversed before
        let checkPreviousConversation = await Negotiation.find({influencerEmail:email,
            merchantEmail:getMerchant.email}).lean()
        if (!checkPreviousConversation) {
        let negotiation = new Negotiation(req.body)
        // negotiation.influencerMessages.push(req.body.influencerMessages)
        // await negotiation.markModified("influencerMessages")
        await negotiation.save()

        return res.json({code:201,data:negotiation})
        }else{
            return res.json({code:200,data:checkPreviousConversation})
        }
        
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

//influencer accept button
const influencerAcceptsPrice = async (req,res) => {
    const {email} = req.user;
    const id = req.params.id
    //get the particular chat and make sure only the influencer accesses it
    const selectInfluencer = await Negotiation.findById(id).lean()
    if  (!selectInfluencer) return res.json({code:404,message:"Chat Not found"})
    if (req.user.userType !== "EX90IF") return res.json({code:401,message:"You are unauthorized to access this resource"})
    //verify that the system has a valid merchant and valid influencer to send mails to
    // update the merchant and influencer status
    let findMerchant = await Profiles.find({email:selectInfluencer.merchantEmail}).lean()
    if (!findMerchant) return res.json({code:404,message:"Merchant not found!"})
    let findInfluencer = await Influencer.find({email:selectInfluencer.influencerEmail}).lean()
    if (!findInfluencer) return res.json({code:404,message:"Influencer not found!"})
    //update the merchant pending campaigns
    findMerchant.pendingCampaigns = await findMerchant.pendingCampaigns - 1
    findMerchant.ongoingCampaigns = await findMerchant.ongoingCampaigns + 1
    //add to the list of influencers
    await findMerchant.influencers.push(findInfluencer._id)
    //update via markmodified
    await findMerchant.markModified("pendingCampaigns")
    await findMerchant.markModified("ongoingCampaigns")
    await findMerchant.markModified("influencers")
    await findMerchant.save()
    //update the influencer pending jobs
    findInfluencer.pendingJobs = await findInfluencer.pendingJobs - 1
    findInfluencer.currentJobs =  await findInfluencer.currentJobs + 1
    await findInfluencer.exciteClients.push(findMerchant._id)
    //update via markmodified
    await findInfluencer.markModified("pendingJobs")
    await findInfluencer.markModified("currentJobs")
    await findInfluencer.markModified("exciteClients")
    await findInfluencer.save()
    await Negotiation.findOneAndUpdate({_id:id},{status:"Accepted"},{
        new:true,runValidators:true, function (err,docs) {
            if (err){
                console.error(err)
            }
            console.log(docs)
        }
    })
    //send mail to the influencer and user 
}


//influencer reject offer
const influencerDeclinePrice = async (req,res)  => {
    try {
        const {email} = req.user
        const id = req.params.id
        //get a specific chat
        if (!req.user.userType === "EX90IF") return res.json({code:401,message:"you are unauthorized to view this page"})
        const getChat = await Negotiation.findById(id).lean()
        if (!getChat) return res.json({code:404,message:"Chat not found"})
        //find the merchant that matches thee chat section
        let matchProfile = await Profiles.find({email:getChat.merchantEmail}).lean()
        if (!matchProfile) return res.json({code:404,message:"not found"})
        matchProfile.pendingCampaigns = matchProfile.pendingCampaigns - 1
        await matchProfile.markModified("pendingCampaigns")
        await matchProfile.save()
        //find the influencer
        let matchInfluencer = await Influencers.find({email:getChat.influencerEmail}).lean()
        if (!matchInfluencer) return res.json({code:404,message:"Not found !"})
        matchInfluencer.pendingJobs = matchInfluencer.pendingJobs - 1
        await matchInfluencer.markModified("pendingJobs")
        await matchInfluencer.save()
        //send mail
        //delete the  chat history
        await Negotiation.deleteOne({_id:id})
        return res.json({status:200, message:"negotiation succesfully ran and completed !"})
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}
// router.delete()
// const influencerDeclineOffer = (req,res) => {


// }
//display all chats
const getAllChats = async (req,res) => {
    try {
        const {email} = req.user
        if (req.user.userType !== "EX90IF" || req.user.userType !== "EX20AF") return res.json({code:401,message:"you are unauthorized to view this resource !"})
        if (req.user.userType === "EX90IF"){
            let chatHistory = await Negotiation.find({influencerEmail:email}).lean()
            if (!chatHistory) return res.json({code:404,message:"Not found"})
            return  res.json({code:200,data:chatHistory})
        } else if (req.user.userType === "EX20AF"){
            let merchantChatHistory = await Negotiation.find({merchantEmail:email}).lean()
            if (!merchantChatHistory) return res.json({code:404,message:"Not found"})
            return res.json({code:200,data:merchantChatHistory})
        }
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}

module.exports = {
    merchantPickInfluencer,
    influencerNegotiation,
    getInfluencerDashboard,
    merchantDashboard,
    influencerAgreePrice,
    influencerNegotiatePrice,
    merchantNegotiateOffer,
    influencerAcceptsPrice,
    influencerDeclinePrice,
    getAllChats
}