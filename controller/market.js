const Products = require('./../models/Products');
const Profiles = require('./../models/Profiles');
const {PostToSocialMedia} = require('./../social/social')

const getCategory = async (req,res)=>{
    const {category} =req.body
    const data = await Products.find({category:category});

    res.json({code:201,category: data})
}

const getItemById = async (req,res)=>{
    const id = req.params.id
    // console.log(id)
    // 
    const item = await Products.findOne({_id:id})
    res.json({code:201,item})
}


const addElectronics = async (req,res)=>{
    const {title,description,price,brand,subCategory,condition,images} = req.body
       // console.log(req.body)
       const {email} = req.user
       const profile = await Profiles.findOne({email:email})
       const storeInfo=profile.storeInfo
       const priority=profile.subscriptionLevel
       const item = {title,description,price,brand,subCategory,condition,storeInfo,category:'electronics',email:email,priority,images:images}
       const newProduct = new Products(item)
       newProduct.save()
   
       if(profile.subscriptionLevel !== 3) return res.json({code:201, msg:"product added"});
   
       // Post to social media
       const data = {title:`${title} for ${price}`, imageUrl:"https://picsum.photos/200/300"}
       const socialPosting =await PostToSocialMedia(email,data);
       if(!socialPosting) return res.json({code:400,msg:"Failed to post to social media"});
       // Posted
       res.json({code:201,msg:"posted to social",added:true});
}
const addFashion = async (req,res)=>{
    const {title,description,price,brand,subCategory,condition,size,gender,images} = req.body
       // console.log(req.body)
       const {email} = req.user
       const profile = await Profiles.findOne({email:email})
       const storeInfo=profile.storeInfo
       const priority=profile.subscriptionLevel
       const item = {title,description,price,brand,subCategory,condition,storeInfo,category:'fashion',email:email,priority,size,gender,images:images}
       const newProduct = new Products(item)
       newProduct.save()
       if(profile.subscriptionLevel !== 3) return res.json({code:201, msg:"product added"});
       // Post to social media
       const data = {title:`${title} for ${price}`, imageUrl:"https://picsum.photos/200/300"}
       const socialPosting =await PostToSocialMedia(email,data);
       if(!socialPosting) return res.json({code:400,msg:"Failed to post to social media"});
       // Posted
       res.json({code:201,msg:"posted to social",added:true});
}
const addPhoneTablet = async (req,res)=>{
    const {title,description,price,brand,subCategory,condition,images} = req.body
       // console.log(req.body)
       const {email} = req.user
       const profile = await Profiles.findOne({email:email})
       const storeInfo=profile.storeInfo
       const priority=profile.subscriptionLevel
       const item = {title,description,price,brand,subCategory,condition,storeInfo,category:'phones-tablets',email:email,priority,images:images}
       const newProduct = new Products(item)
       newProduct.save()
       if(profile.subscriptionLevel !== 3) return res.json({code:201, msg:"product added"});
       // Post to social media
       const data = {title:`${title} for ${price}`, imageUrl:"https://picsum.photos/200/300"}
       const socialPosting =await PostToSocialMedia(email,data);
       if(!socialPosting) return res.json({code:400,msg:"Failed to post to social media"});
       // Posted
       return res.json({code:201,msg:"posted to social",added:true});
}
const addHome = async (req,res)=>{
    const {title,description,price,brand,subCategory,condition,room,images} = req.body
       // console.log(req.body)
       const {email} = req.user
       const profile = await Profiles.findOne({email:email})
       const storeInfo=profile.storeInfo
       const priority=profile.subscriptionLevel
       const item = {title,description,price,brand,subCategory,condition,storeInfo,category:'home-kitchen-appliance',email:email,priority,room,images:images}
       const newProduct = new Products(item)
       newProduct.save()
       if(profile.subscriptionLevel !== 3) return res.json({code:201, msg:"product added"});
       // Post to social media
       const data = {title:`${title} for ${price}`, imageUrl:"https://picsum.photos/200/300"}
       const socialPosting =await PostToSocialMedia(email,data);
       if(!socialPosting) return res.json({code:400,msg:"Failed to post to social media"});
       // Posted
       return res.json({code:201,msg:"posted to social",added:true});
}

const addVehicle = async (req,res)=>{
    const {title,description,price,brand,subCategory,condition,year,fuelType,transmission,images} = req.body
       // console.log(req.body)
       const {email} = req.user
       const profile = await Profiles.findOne({email:email})
       const storeInfo=profile.storeInfo
       const priority=profile.subscriptionLevel
       const item = {title,description,price,brand,subCategory,condition,storeInfo,category:'vehicle',email:email,priority,year,fuelType,transmission,images:images}
       const newProduct = new Products(item)
       newProduct.save()
       if(profile.subscriptionLevel !== 3)return res.json({code:201, msg:"product added"});
       // Post to social media
       const data = {title:`${title} for ${price}`, imageUrl:"https://picsum.photos/200/300"}
       const socialPosting =await PostToSocialMedia(email,data);
       if(!socialPosting) return res.json({code:400,msg:"Failed to post to social media"});
       // Posted
       return res.json({code:201,msg:"posted to social",added:true});
}



module.exports={
    getCategory,
    getItemById,
    addElectronics,
    addFashion,
    addPhoneTablet,
    addHome,
    addVehicle,
}