const Agents = require('../models/Agents');

const agentsProfile = async (req,res) => {
    const {email} = req.user;
    try {
    const profile=await Agents.findOne({email:email}).populate(["earnings",'merchants','payouts'])
    if(profile){
        return res.json({code:200,profile:profile})
    }else{
        return res.json({code:404})
    }
    } catch (error) {
        console.log(error)
        return res.status(500).json({code:500})
    }
}

const uploadToProfile=async(req,res)=>{
    const {email} = req.user;
    const {field,data} = req.body;
    try {
    const profile=await Agents.findOne({email:email})
    if(profile){
        profile[field]=data;
        await profile.save();
        return res.json({code:201,profile:profile})
    }else{
        return res.json({code:404})
    }
    } catch (error) {
        return res.status(500).json({code:500})
    }
}

const updateBankProfile = async (req,res)=>{
    const {email} = req.user;
    const {bank,accountNo,accountName} = req.body
    try {
        const profile=await Agents.findOne({email:email})
        if(profile){
            profile.accountDetails.bank=bank;
            profile.accountDetails.accountNo=accountNo;
            profile.accountDetails.accountName=accountName;
            profile.markModified('accountDetails')
            await profile.save();
            return res.json({code:201,profile:profile})
        }else{
            return res.json({code:404})
        }
        } catch (error) {
            return res.status(500).json({code:500})
        }
}
const updateBio = async (req,res)=>{
    const {email} = req.user;
    
    try {
        const {fullName,mobile,address} = req.body;
        const profile=await Agents.findOne({email:email})
        if(profile){
            profile.fullName=fullName;
            profile.mobile=mobile;
            profile.address=address;
            await profile.save();
            return res.json({code:201,profile:profile})
        }else{
            return res.json({code:404})
        }
        } catch (error) {
            return res.status(500).json({code:500})
        }
}

module.exports={
    agentsProfile,
    uploadToProfile,
    updateBankProfile,
    updateBio
} 
