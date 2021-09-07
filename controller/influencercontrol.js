// required imports: controller modules, influencer models,merchant innfluencer models,merchant models 
const influencerMerchantModel = require('../models/merchantinfluencer');
const nodeoutlook = require('nodejs-nodemailer-outlook');
const Influencer = require('../models/influencer');
const bargainModel = require('../models/bargain');
const influencerNotification = require('../emails/influencer_engagement');
const paymentInfluencerNotification = require('../emails/payment_notification');
const influencerAgreePrice = require('../emails/influencer_agreement');
const merchantAgreePrice = require('../emails/merchant_agreement');
const Profiles = require('../models/Profiles');
const agreePrice = require('../models/agreeprice');
const Negotiation = require('../models/infMerchantNegotiate');
// todo access control vulnerabilities
//restricting users where possible


const getPricingRange = (Reach,posts,months,out) => {
    let lowPricing = 2.2*Reach*posts*months*out
    let highPricing = 4.2*Reach*posts*months*out
    return {low:lowPricing.toFixed(2), high:highPricing.toFixed(2)}
}

const unitPricingRange = (Reach,out) => {
    let lowUnitPricing = 2.2*Reach*out
    let highUnitPricing = 4.2*Reach*out

    return {low:lowUnitPricing.toFixed(2),high:highUnitPricing.toFixed(2)}
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
            timeUnit,
            output,
            unitPost,
            durationOfPromotion,
            unitMonth,
            crossPlatformPromotion,
            deliverable,
            deliveryType,
            coverage,
            pricing,
            unitPricing,
            offerPrice,
            // influencerName
        } = req.body
        //verify that the user is a merchant
        if (userType !== "EX10AF") return res.json({code:401,message:"You must be a merchant to access this resource"})
        //get the influencer level (could be one of micro,mini,max)
        // const getInfluencerLevel = influencerLevel.replaceAll(" ","").split("")[0].toLowerCase()
        // console.log(getInfluencerLevel)
        if (timeUnit === "day") output = 30
        if (timeUnit === "week") output = 4
        if (timeUnit === "month") output = 1
        if (timeUnit === "year") output = 1 / 12
        pricing = getPricingRange(reach,noOfPosts,durationOfPromotion,output)
        unitPricing = unitPricingRange(reach,output)
        // let newMerchantInfluencer = new influencerMerchantModel({...req.body,pricing,unitPricing})
        // newMerchantInfluencer.markModified("pricing")
        // newMerchantInfluencer.markModified("unitPricing")
        // influencerMerchantModel.markModified("pricing")
        // influencerMerchantModel.markModified("unitPricing")
        // await newMerchantInfluencer.save()
        //filter only the approved influencers
    //    const approvedInfs = Influencer.find({regStatus:"accepted"})
    // todo sort the selected influencers based on their followers
        const matchedInfluencers = await Influencer.find({$or:[{marketingSpecialty:productServiceCategory},
            {influencerLevel:influencerLevel}]}) 
            // 
        //find an influencer based on these parameters
        if (matchedInfluencers.length === 0) return res.json({code:404,data:"no matches for your budget",
        prices:[pricing,unitPricing]})
        return res.json({code:200,data:matchedInfluencers,prices:[pricing,unitPricing]})
    } catch (err) {
           console.error(err) 
        return res.json({code:500,message:err.message})
    }
} 

//following the first request
//pick a specific influencer for negotiation

const influencerNegotiation = async (req,res) => {
    try {
        const {email,userType} = req.user
        const id = req.params.id
        if (req.user.userType !== "EX10AF") return res.json({code:401,message:"You must be a merchant to access this resource"})
        //filter only the approved influencers
        // const approvedInfluencers = Influencer.find({regStatus:"accepted"})
        let profile = await Profiles.findOne({email:email})
        if (!profile) return res.json({code:404,message:"No merchant with that email address was found"})
        const getInfluencer =  await Influencer.findById(id).lean()
        if (!getInfluencer) return res.json({code:404,message:"this influencer cannot be found !"})
        //increase the merchant campaign
       let pendingIncrement = profile.pendingCampaigns + 1
    //    profile.pendingCampaigns =await profile.pendingCampaigns + 1
    //     profile.markModified("pendingCampaigns")
    //     await profile.save()
        //mark modify profiles
        let pending = getInfluencer.pendingJobs
        let newpending = pending + 1
        console.log(newpending)
        //update the merchant pending campaigns
        await Profiles.findOneAndUpdate({email:email},{pendingCampaigns:pendingIncrement},{new:true,runValidators:true},
            function (err,docs){
                if (err) console.error(err)
                console.log(docs) 
            })
        await Influencer.findOneAndUpdate({_id:id},{pendingJobs:newpending},{new:true,runValidators:true},
            function (err,docs){
                if (err) console.error(err)
                console.log(docs) 
            })
        // getInfluencer.pendingJobs = await getInfluencer.pendingJobs + 1
        // await getInfluencer.markModified("pendingJobs")
        // create a new negotiation document
        let negotiation = {

        influencerEmail:getInfluencer.email,
        influencerFullName:getInfluencer.fullName,
        merchantEmail:email,
        merchantFullName:profile.fullname,
        merchantMessages:[],
        influencerMessages:[],
        startDateStr:"",
        startDate:0,
        endDate:0,
        product:req.body.productName,
        offerPrice:req.body.offerPrice,
        negotiationStatus:"pending"

        }

        let newNegotiationDocument = new Negotiation(negotiation)
        await newNegotiationDocument.save()

        let firstName = getInfluencer.fullName.split(' ')[0]
        let offerPrice = req.body.offerPrice
        let durationOfPromotion = req.body.durationOfPromotion
        let reach = req.body.reach
        let newMerchantInfluencer = new influencerMerchantModel({...req.body,email:email,userType:userType})
        newMerchantInfluencer.markModified("pricing")
        newMerchantInfluencer.markModified("unitPricing")
        await newMerchantInfluencer.save()
        nodeoutlook.sendEmail({
            auth: {
              user: process.env.EXCITE_ENQUIRY_USER,
              pass: process.env.EXCITE_ENQUIRY_PASS,
            },
              from: 'enquiry@exciteafrica.com',
              to: getInfluencer.email,
              subject: 'EXCITE INFLUENCER MARKETING ENGAGEMENT NOTIFICATION',
              html: influencerNotification(firstName,profile.fullName,offerPrice,durationOfPromotion,reach),
              text: influencerNotification(firstName,profile.fullName,offerPrice,durationOfPromotion,reach),
              replyTo: 'enquiry@exciteafrica.com',
              onError: (e) => console.log(e),
              onSuccess: (i) => {
              // return res.json({code:200,message: 'Reset mail has been sent',userType:user.userType});
              console.log(i)
              },
              secure:false,
          })
          await getInfluencer.save((err,docs)=>{
              console.log(err)
          })
        
        return res.json({code:200,data:{...getInfluencer,...profile[fullName]},message:"an email has been sent to the influencer you just selected,expect to hear from him/her soon !",
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

//merchant dashboard
const merchantDashboard = async (req,res) => {
    try {
        const {email} = req.user
        let profile = await Profiles.findOne({email:email}).lean()
        if (req.user.userType !== "EX10AF") return res.json({code:401,message:"you are not allowed to view this resource"})
        //filter the list of influencers to the one with the same id
        let influencerData = {...profile.ongoingCampaigns,...profile.pendingCampaigns,...profile.influencer}
        return res.json({code:200,data:influencerData})
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}

//allow merchant to cancel out a pending response
// const merchantDeclinePendings = async (req,res)=> {
//     const {email} = req.user
//     try {
//         if (req.user.userType !== "EX10AF") return res.json({code:401,message:"You must be a merchant to access this resource"})
//         const getNegotiateMerchant = await Negotiation.find({merchantEmail:email})
//         return res.json({code:200,data:getNegotiateMerchant})
//     } catch (err) {
//         console.error(err)
//         return res.json({code:500,message:err.message})
//     }
// }

// influencer accept offer /agree route
const merchantPaymentPrice = async (req,res) => {
    try {
        const {email,userType} = req.user
        if (userType !== "EX10AF") return res.json({code:401,message:"You are not authorized to access this resource !"})
        req.body.email = email
        req.body.userType = userType
        req.body.createdAt = new Date().toString()
        req.body.startDate = Date.now()
        req.body.endDate = Number(req.body.startDate) + 3 * (30*24*60*60*1000)
        req.body.amountToPay = Number(req.body.price) * Number(req.body.duration)
        req.body.negotiationStatus = "accepted"
        //get the merchant details and name
        const merchant = await Profiles.findOne({email:email})
        //find the influencer the paymment is meant for in the database
        const influencerToPay = await Influencer.findOne({fullName:req.body.fullName})
        if (!influencerToPay) return res.json({code:404,message:"Can't find this influencer, Please enter the influencer's name as you received it from your email"})
        const newPrice = new agreePrice(req.body)
        //pay via paystack
        await newPrice.save()
        //update the negotiation status in the merchant negotation collection
        //const negotiation = await Negotiation.findOne({merchantEmail:email,influencerEmail:influencerToPay.email}) 
        //send mail to influencer while paystack sends a receipt to the merchant
        
        //  nodeoutlook.sendEmail({
        //     auth: {
        //       user: process.env.EXCITE_ENQUIRY_USER,
        //       pass: process.env.EXCITE_ENQUIRY_PASS,
        //     },
        //       from: 'enquiry@exciteafrica.com',
        //       to: influencerToPay.email,
        //       subject: 'NOTIFICATION OF PAYMENT BY MERCHANT FOR INFLUENCER MARKETING',
        //       html: paymentInfluencerNotification(influencerToPay.fullName,merchant.fullName,req.body.amountToPay,req.body.duration),
        //       text: paymentInfluencerNotification(influencerToPay.fullName,merchant.fullName,req.body.amountToPay,req.body.duration),
        //       replyTo: 'enquiry@exciteafrica.com',
        //       onError: (e) => console.log(e),
        //       onSuccess: (i) => {
        //       // return res.json({code:200,message: 'Reset mail has been sent',userType:user.userType});
        //       console.log(i)
        //       },
        //       secure:false,
        //   })
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
        if (!getMerchant) return res.json({code:404,message:"Merchant not found, this merchant has either declined the offer or you are entering his/her name in the wrong format !"})
        req.body.influencerEmail = email
        req.body.merchantEmail = getMerchant.email
        req.body.merchantFullName = req.body.fullName
        req.body.influencerFullName = negotiateInfluencer.fullName
        //find the product of the merchant and influencer negotiation model
        let getProduct = await influencerMerchantModel.findOne({email:getMerchant.email,
            influencerName:negotiateInfluencer.fullName}).lean()
        req.body.product = getProduct.productName
        //check if this particular people has conversed before
        let checkPreviousConversation = await Negotiation.findOne({influencerEmail:email,
            merchantEmail:getMerchant.email}).lean()
        if (!checkPreviousConversation) {
        let negotiation = new Negotiation(req.body)
        // negotiation.influencerMessages.push(req.body.influencerMessages)
        // await negotiation.markModified("influencerMessages")
        await negotiation.save()

        return res.json({code:201,data:negotiation})
        }else{
            await Negotiation.findOneAndUpdate({influencerEmail:email,
                merchantEmail:getMerchant.email},{product:getProduct.productName},
                {new:true,runValidators:true})
            return res.json({code:200,data:checkPreviousConversation})
        }
        
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}

//send message back to influencer
const merchantNegotiateOffer = async (req,res) => {
    try {
        const id = req.params.id
        const {email} = req.user
        //first conditional: send the message to the  right influencer
        if (req.user.userType === "EX10AF"){
        let merchantNegotiationEmail = await Negotiation.findById(id).lean()
        if (!merchantNegotiationEmail) return res.json({code:404,message:"Not found !, it has probably been declined and deleted by either merchant or influencer"})
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
            if (!influencerNegotiationEmail) return res.json({code:404,message:"Not found !,it has probably been declined and deleted by either merchant or influencer"})
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
    try {
    const {email} = req.user;
    const id = req.params.id;
    //get the particular chat and make sure only the influencer accesses it
    const selectInfluencer = await Negotiation.findById(id).lean()
    if  (!selectInfluencer) return res.json({code:404,message:"Chat Not found !,it has probably been declined and deleted by either merchant or influencer"})
    if (req.user.userType !== "EX90IF") return res.json({code:401,message:"Only the influencer can make this action"})
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
        new:true,runValidators:true}, function (err,docs) {
            if (err){
                console.error(err)
            }
            console.log(docs)
        })

    //send mail to the influencer and merchant
    //influencer's agreement mail
     nodeoutlook.sendEmail({
            auth: {
              user: process.env.EXCITE_ENQUIRY_USER,
              pass: process.env.EXCITE_ENQUIRY_PASS,
            },
              from: 'enquiry@exciteafrica.com',
              to: findInfluencer.email,
              subject: 'INFLUENCER MARKETING AGREEMENT',
              html: influencerAgreePrice(findInfluencer.fullName.split(' ')[0],findMerchant.fullName),
              text: influencerAgreePrice(findInfluencer.fullName.split(' ')[0],findMerchant.fullName),
              replyTo: 'enquiry@exciteafrica.com',
              onError: (e) => console.log(e),
              onSuccess: (i) => {
              // return res.json({code:200,message: 'Reset mail has been sent',userType:user.userType});
              console.log(i)
              },
              secure:false,
          })
          // merchant's agreement email
          nodeoutlook.sendEmail({
            auth: {
              user: process.env.EXCITE_ENQUIRY_USER,
              pass: process.env.EXCITE_ENQUIRY_PASS,
            },
              from: 'enquiry@exciteafrica.com',
              to: findInfluencer.email,
              subject: 'INFLUENCER MARKETING AGREEMENT',
              html: merchantAgreePrice(findInfluencer.fullName.split(' ')[0],findMerchant.fullName),
              text: merchantAgreePrice(findMerchant.fullName.split(' ')[0],findInfluencer.fullName),
              replyTo: 'enquiry@exciteafrica.com',
              onError: (e) => console.log(e),
              onSuccess: (i) => {
              // return res.json({code:200,message: 'Reset mail has been sent',userType:user.userType});
              console.log(i)
              },
              secure:false,
          })

    return res.json({code:200,message:"message sent successfully, check your mail for the next steps"})
   } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}


//influencer merchant reject offer
const influencerMerchantDeclinePrice = async (req,res)  => {
    try {
        const {email} = req.user
        const id = req.params.id
        //get a specific chat
        if (req.user.userType !== "EX90IF" || req.user.userType !== "EX10AF") return res.json({code:401,message:"Only the influencer or merchant can make this action"})
        const getChat = await Negotiation.findById(id).lean()
        if (!getChat) return res.json({code:404,message:"Chat not found !, it has probably been declined and deleted by either merchant or influencer"})
        //find the merchant that matches the chat section
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
        //send mail on conditionals of the userType : influencer or merchant
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
        if (req.user.userType !== "EX90IF" || req.user.userType !== "EX10AF") return res.json({code:401,message:"you are unauthorized to access this resource !"})
        if (req.user.userType === "EX90IF"){
            let chatHistory = await Negotiation.find({influencerEmail:email}).lean()
            if (!chatHistory) return res.json({code:404,message:"You have no chat history!"})
            return  res.json({code:200,data:chatHistory})
        } else if (req.user.userType === "EX10AF"){
            let merchantChatHistory = await Negotiation.find({merchantEmail:email}).lean()
            if (!merchantChatHistory) return res.json({code:404,message:"you have no chat history!"})
            return res.json({code:200,data:merchantChatHistory})
        }
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}

//get a specific chat section
const singleChat = async (req,res) => {
    const {email,userType} = req.user
    try {
        if (!userType === "EX10AF" || !userType === "EX90IF") return res.json({code:401,message:"You do not have permission to view this resource"})
       const id = req.params.id
       const getSingleChat = await Negotiation.findById(id).lean()
       if (!getSingleChat) return res.json({code:404,message:"chat not found !, it has probably been declined and deleted by either merchant or influencer"})
       return res.json({code:200,message:getSingleChat})
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}

const getMerchantPendings = async (req,res) => {
    try{
    const {email} = req.user
    if (req.user.userType !== "EX10AF") return res.json({code:401,message:"You are not allowed to view this resource"})
    let allMerchantPending = await Negotiation.find({merchantEmail:email,negotiationStatus:"pending"}).lean()
    return res.json({code:200,data:allMerchantPending})
    } catch (err){
    console.error(err)
    return res.json({code:500,message:err.message})
    }
}

const getMerchantAccepted = async (req,res) => {
    try {
    const {email} = req.user
    if (req.user.userType !== "EX10AF") return res.json({code:401,message:"You are not allowed to view this resource"})
    let allMerchantAccepted = await Negotiation.find({merchantEmail:email,negotiationStatus:"Accepted"}).lean()
    return res.json({code:200,data:allMerchantAccepted})
    } catch (err){
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}

const getMerchantCompleted = async (req,res) => {
    try {
    const {email} = req.user
    if (req.user.userType !== "EX10AF") return res.json({code:401,message:"You are not allowed to view this resource"})
    let allMerchantComplete = await Negotiation.find({merchantEmail:email,negotiationStatus:"completed"}).lean()
    return res.json({code:200,message:allMerchantComplete})
    } catch(err){
        console.error(err)
        return res.json({code:500,message:err.message})
    }

}

const getInfluencerPendings = async (req,res) => {
    try{
    const {email} = req.user
    if (req.user.userType !== "EX90IF") return res.json({code:401,message:"You are not allowed to view this resource"})
    let allInfluencerPending = await Negotiation.find({influencerEmail:email,negotiationStatus:"pending"}).lean()
    return res.json({code:200,data:allInfluencerPending})
    } catch(err){
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}

const getInfluencerAccepted = async (req,res) => {
    try {
    const {email} = req.user
    if (req.user.userType !== "EX90IF") return res.json({code:401,message:"You are not allowed to view this resource"})
    let allInfluencerAccepted = await Negotiation.find({influencerEmail:email,negotiationStatus:"Accepted"}).lean()
    return res.json({code:200,data:allInfluencerAccepted})
    } catch(err){
        console.error(err)
        return res.json({code:200,message:err.message})
    }
    
}

const getInfluencerCompleted = async (req,res) => {
    try {
    const {email} = req.user
    if (req.user.userType !== "EX90IF") return res.json({code:401,message:"You are not allowed to view this resource"})
    let allInfluencerComplete = await Negotiation.find({influencerEmail:email,negotiationStatus:"completed"}).lean()
    return res.json({code:200,data:allInfluencerComplete})
    } catch (err){
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}

// get the overall design pattern to track the accepted seection to the payments section to the reports section to the payment tracking session 
// GET weekly reports
// PAYMENT POPUP VIEW 

module.exports = {
    merchantPickInfluencer,
    influencerNegotiation,
    getInfluencerDashboard,
    merchantDashboard,
    merchantPaymentPrice,
    influencerNegotiatePrice,
    merchantNegotiateOffer,
    influencerAcceptsPrice,
    influencerMerchantDeclinePrice,
    getAllChats,
    singleChat,
   // merchantDeclinePendings,
    getMerchantPendings,
    getMerchantCompleted,
    getMerchantAccepted,
    getInfluencerPendings,
    getInfluencerAccepted,
    getInfluencerCompleted
}