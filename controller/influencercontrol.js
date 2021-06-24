// required imports: controller modules, influencer models,merchant innfluencer models,merchant models 
const influencerMerchantModel = require('../models/merchantinfluencer');
const nodeoutlook = require('nodejs-nodemailer-outlook');
const Influencer = require('../models/influencer');
const bargainModel = require('../models/bargain');
const influencerNotification = require('../emails/influencer_engagement')
const Profiles = require('../models/Profiles')

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
            // pricing,
            // unitPricing
        } = req.body
        // req.body.email = email
        // req.body.userType = userType
        //get the influencer level (could be one of micro,mini,max)
        // const getInfluencerLevel = influencerLevel.replaceAll(" ","").split("")[0].toLowerCase()
        // console.log(getInfluencerLevel)
        pricing = getPricingRange(reach,noOfPosts,durationOfPromotion)
        unitPricing = unitPricingRange(reach)
        let newMerchantInfluencer = new influencerMerchantModel({...req.body,pricing:getPricingRange(reach,noOfPosts,durationOfPromotion),unitPricing:unitPricingRange(reach)})
        newMerchantInfluencer.markModified("pricing")
        newMerchantInfluencer.markModified("unitPricing")
        // influencerMerchantModel.markModified("pricing")/
        // influencerMerchantModel.markModified("unitPricing")
        await newMerchantInfluencer.save()
        //filter only the approved influencers
    //    const approvedInfs = Influencer.find({regStatus:"accepted"})
        const matchedInfluencers = await Influencer.find({$or:[{marketingSpecialty:productServiceCategory},
            {influencerCategory:influencerLevel}]}) 
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
        let profile = await Profiles.find({email:email}).populate("Product")
        .populate("Customer")
        .populate("PostTransaction")
        .populate("influencer")
        const getInfluencer =  await Influencer.findById(id).lean()
        if (!getInfluencer) return res.json({code:404,message:"no user with that identifier"})
        profile.influencers.push(getInfluencer._id)
        let pending = getInfluencer.pendingJobs
        await profile.save()
        await Influencer.findOneAndUpdate({_id:id},{pending:pending+1},{returnOriginal: false,runValidators:true},
            function (err,docs){
                if (err) console.error(err)
                console.log(docs) 
            })
        // getInfluencer.pendingJobs = await getInfluencer.pendingJobs + 1
        await getInfluencer.markModified("pendingJobs")
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
        //       html: influencerNotification(firstName,id),
        //       text: influencerNotification(firstName,id),
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
const bargainSendInfluencer = async (req,res) => {
    try {
        const {email} = req.user
        req.body.sender = email
    const newBargainChat = new bargainModel(req.body)
    await newBargainChat.save()
    return res.json({code:200,data:newBargainChat})
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}

//GET recieved messages tailored to the merchant or influencer
const bargainReceiveInfluencer = (req,res) => {
    try {
        const {email} = req.user
        const filterReceivedMessages = bargainModel.find({receiver:email}).lean().sort({'receiver':-1});
        return res.json({code:200,data:filterReceivedMessages})
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
}

//merchant dashboard
const merchantDashboard = async (req,res) => {
    try {
        const id = req.params.id
        let profile = Profiles.findById(id).populate("Product")
        .populate("Customer")
        .populate("PostTransaction")
        .populate("influencer")
        //filter the list of influencers to the one with the same id
        let influencerData = {...profile.ongoingCampaigns,...profile.pendingCampaigns,...profile.influencer}
        return res.json({code:200,data:influencerData})
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }


}
// influencer accept offer

//influencer reject offer
// router.delete()


module.exports = {
    MerchantPickInfluencer,
    getInfluencerDashboard,
    merchantDashboard,
    influencerNegotiation,
    bargainSendInfluencer,
    bargainReceiveInfluencer
}