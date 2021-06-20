// required imports: controller modules, influencer models,merchant innfluencer models,merchant models 
const influencerMerchantModel  =  require('../models/merchantinfluencer');
const Influencer =  require('../models/influencer');

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
    return [2.4*Reach*posts,4.4*Reach*posts*months]

}

const MerchantPickInfluencer = async (req,res) => {
    try {
        // const {email,userType} = req.user;
        const {
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
            durationOfPromotion,
            crossPlatformPromotion,
            deliverable,
            deliveryType,
            coverage,
            pricing
        } = req.body
        // req.body.email = email
        // req.body.userType = userType
        //get the influencer level (could be one of micro,mini,max)
        const getInfluencerLevel = influencerLevel.replaceAll(" ","").split("")[0].toLowerCase()

        pricing = getPricingRange(reach,noOfPosts,durationOfPromotion)
        await  influencerMerchantModel.create(req.body)
        const matchedInfluencers = Influencer.find({$or:[{marketingSpecialty:productServiceCategory},
            {influencerCategory:influencerLevel}]})
        //find an influencer based on these parameters
        if (matchedInfluencers.length === 0) return res.json({code:200,data:"no matchesfor your budget"})
        return res.json({code:200,data:matchedInfluencers})
    } catch (err) {
        console.error(err)
        return res.json({code:500,message:err.message})
    }
} 
// POST metric influencer fill form
// GET influencer dahsboard view
const getInfluencerDashboard = async (req,res) => {
    try {
        const id = req.params.id
        const singleInfluencer = await Influencer.findById(id).lean()
        if (singleInfluencer.regStatus.isApproved === 'pending'){
            return res.json({code:404,message:"No data yet, awaiting approval"})
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


module.exports = {

    MerchantPickInfluencer,
    getInfluencerDashboard
}