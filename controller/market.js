const Products = require('./../models/Products');
const Profiles = require('../models/Profiles');
const Banners = require('./../models/adBanner');
const Deals = require('./../models/deals')
const {PostToSocialMedia} = require('./../social/social')
const ProductRecord =require('../models/bookkeeping');
// const re {  } from '../models/receivablesBook';

//search functionality via mongodb text-search library
const filterProducts = async (req,res) => {
  try {

    let findFilter = await Products.find({$text: {$search: req.query['product']}}).lean()

    if (findFilter.length === 0) return res.json({code:404,message:"No products found !"})

    res.json({code:200,message:findFilter})
    
  } catch (err) {
    res.json({code:500,message:err.message})
  }

}

//search filter funnctionality
// const filterProduct = async (req,res) =>  {

//   //store each individual product in an array
//   let individualProduct = [];

//   const allProducts = await Products.find({}).sort({'createdAt':-1}).lean();
//    allProducts.forEach((productList)=>{
//     individualProduct.push(productList.title)
//   })

//   console.log(individualProduct)
  
//     // if (! req.query.product === producTitle) {
//     //   return res.json({code:400,message:"oops, There are no products with this name !"})

//     // }

//         //get the filtered product
//         console.log(allProducts.title)
//         // for (let products of allProducts) {
//         //   products.title = products.title.split(' ')
          
//         // }
//     var productFilt = allProducts.filter(product=>product.title.split(' ').includes(req.query['product']) || req.query['product'] === product.title);

//     if (productFilt.length === 0) return res.json({message:"oops, There are no products with this name !"})
//     // console.log(productFilt)
//     return res.json({code:200,product:productFilt})

// }




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
const getOfferById = async (req,res)=>{
    const id = req.params.id
    // console.log(id)
    //
    const item = await Deals.findOne({_id:id})
    res.json({code:201,item})
}


const addElectronics = async (req,res)=>{
    const {title,description,price,brand,subCategory,condition,images,quantity,salesTarget,} = req.body
       // console.log(req.body)
       const {email} = req.user
       const profile = await Profiles.findOne({email:email})
       const storeInfo=profile.storeInfo
       if(!storeInfo.storeName || !storeInfo.storeAddress || !storeInfo.storeName) return res.json({code:404 , message:"Please update store info"});
       const priority=profile.subscriptionLevel
       const item = {title,description,price,brand,subCategory,condition,storeInfo,category:'electronics',email:email,priority,images:images}
       const newProduct = new Products(item)
       // newProduct.save()
       //
       // stock code
       const stockRecord = {
         productName:title,
         cost:Number(0),
         price:Number(price),
         total:Number(quantity) * Number(price),
         quantity:Number(quantity),
         salesTarget:Number(quantity),
         description,
         storeInfo,
         email,
       }

       const newStock = new ProductRecord(stockRecord);
       const stockId = newStock._id;
       newProduct.stock=stockId;
       newProduct.save()
       try {
         newStock.save()
       } catch  (error) {
         console.log(error);
       }


       if(profile.subscriptionLevel !== 3) return res.json({code:201, msg:"product added"});

       // Post to social media
       const data = {title:`${title} for ${price}`, imageUrl:images[0]}
       const socialPosting =await PostToSocialMedia(email,data);
       if(!socialPosting) return res.json({code:400,msg:"Failed to post to social media"});
       // Posted
       return res.json({code:201,msg:"posted to social",added:true});
}
const addFashion = async (req,res)=>{
    const {title,description,price,brand,subCategory,condition,size,gender,images,quantity,salesTarget,} = req.body
       // console.log(req.body)
       const {email} = req.user
       const profile = await Profiles.findOne({email:email})
       const storeInfo=profile.storeInfo;
       if(!storeInfo.storeName || !storeInfo.storeAddress || !storeInfo.storeName) return res.json({code:404 , message:"Please update store info"});
       const priority=profile.subscriptionLevel
       const item = {title,description,price,brand,subCategory,condition,storeInfo,category:'fashion',email:email,priority,size,gender,images:images,quantity,salesTarget}
       const newProduct = new Products(item)

       // stock code
       const stockRecord = {
        productName:title,
        cost:Number(0),
        price:Number(price),
        total:Number(quantity) * Number(price),
        quantity:Number(quantity),
        salesTarget:Number(quantity),
        description,
        storeInfo,
        email,
      }

      const newStock = new ProductRecord(stockRecord);
      const stockId = newStock._id;
      newProduct.stock=stockId;
      newProduct.save()
      try {
        newStock.save()
      } catch  (error) {
        console.log(error);
      }


    //   social commerce
       if(profile.subscriptionLevel !== 3) return res.json({code:201, msg:"product added"});
       // Post to social media
       const data = {title:`${title} for ${price}`, imageUrl:images[0]}
       const socialPosting =await PostToSocialMedia(email,data);
       if(!socialPosting) return res.json({code:400,msg:"Failed to post to social media"});
       // Posted
       res.json({code:201,msg:"posted to social",added:true});
}
const addPhoneTablet = async (req,res)=>{
    const {title,description,price,brand,subCategory,condition,images,quantity,salesTarget,} = req.body
       // console.log(req.body)
       const {email} = req.user
       const profile = await Profiles.findOne({email:email})
       const storeInfo=profile.storeInfo;
       if(!storeInfo.storeName || !storeInfo.storeAddress || !storeInfo.storeName) return res.json({code:404 , message:"Please update store info"});
       const priority=profile.subscriptionLevel
       const item = {title,description,price,brand,subCategory,condition,storeInfo,category:'phones-tablets',email:email,priority,images:images,quantity,salesTarget,}
       const newProduct = new Products(item)

    //    
       // stock code
       const stockRecord = {
        productName:title,
        cost:Number(0),
        price:Number(price),
        total:Number(quantity) * Number(price),
        quantity:Number(quantity),
        salesTarget:Number(quantity),
        description,
        storeInfo,
        email,
      }

      const newStock = new ProductRecord(stockRecord);
      const stockId = newStock._id;
      newProduct.stock=stockId;
      newProduct.save()
      try {
        newStock.save()
      } catch  (error) {
        console.log(error);
      }


    // social commerce
       if(profile.subscriptionLevel !== 3) return res.json({code:201, msg:"product added"});
       // Post to social media
       const data = {title:`${title} for ${price}`, imageUrl:images[0]}
       const socialPosting =await PostToSocialMedia(email,data);
       if(!socialPosting) return res.json({code:400,msg:"Failed to post to social media"});
       // Posted
       return res.json({code:201,msg:"posted to social",added:true});
}
const addHome = async (req,res)=>{
    const {title,description,price,brand,subCategory,condition,room,images,quantity,salesTarget} = req.body
       // console.log(req.body)
       const {email} = req.user
       const profile = await Profiles.findOne({email:email})
       const storeInfo=profile.storeInfo;
       if(!storeInfo.storeName || !storeInfo.storeAddress || !storeInfo.storeName) return res.json({code:404 , message:"Please update store info"});
       const priority=profile.subscriptionLevel
       const item = {title,description,price,brand,subCategory,condition,storeInfo,category:'home-kitchen-appliance',email:email,priority,room,images:images,quantity,salesTarget}
       const newProduct = new Products(item)
       
        // stock code
        const stockRecord = {
            productName:title,
            cost:Number(0),
            price:Number(price),
            total:Number(quantity) * Number(price),
            quantity:Number(quantity),
            salesTarget:Number(quantity),
            description,
            storeInfo,
            email,
          }
    
          const newStock = new ProductRecord(stockRecord);
          const stockId = newStock._id;
          newProduct.stock=stockId;
          newProduct.save()
          try {
            newStock.save()
          } catch  (error) {
            console.log(error);
          }

        //   social commerce
       if(profile.subscriptionLevel !== 3) return res.json({code:201, msg:"product added"});
       // Post to social media
       const data = {title:`${title} for ${price}`, imageUrl:images[0]}
       const socialPosting =await PostToSocialMedia(email,data);
       if(!socialPosting) return res.json({code:400,msg:"Failed to post to social media"});
       // Posted
       return res.json({code:201,msg:"posted to social",added:true});
}

const addVehicle = async (req,res)=>{
    const {title,description,price,brand,subCategory,condition,year,fuelType,transmission,images,quantity,salesTarget} = req.body
       // console.log(req.body)
       const {email} = req.user
       const profile = await Profiles.findOne({email:email})
       const storeInfo=profile.storeInfo;
       if(!storeInfo.storeName || !storeInfo.storeAddress || !storeInfo.storeName) return res.json({code:404 , message:"Please update store info"});
       const priority=profile.subscriptionLevel
       const item = {title,description,price,brand,subCategory,condition,storeInfo,category:'vehicle',email:email,priority,year,fuelType,transmission,images:images,quantity,salesTarget}
       const newProduct = new Products(item)
    //    newProduct.save()

     // stock code
     const stockRecord = {
        productName:title,
        cost:Number(0),
        price:Number(price),
        total:Number(quantity) * Number(price),
        quantity:Number(quantity),
        salesTarget:Number(quantity),
        description,
        storeInfo,
        email,
      }
      const newStock = new ProductRecord(stockRecord);
      const stockId = newStock._id;
      newProduct.stock=stockId;
      newProduct.save()
      try {
        newStock.save()
      } catch  (error) {
        console.log(error);
      }

    //   social commerce

       if(profile.subscriptionLevel !== 3)return res.json({code:201, msg:"product added"});
       // Post to social media
       const data = {title:`${title} for ${price}`, imageUrl:images[0]}
       const socialPosting =await PostToSocialMedia(email,data);
       if(!socialPosting) return res.json({code:400,msg:"Failed to post to social media"});
       // Posted
       return res.json({code:201,msg:"posted to social",added:true});
}

const getLandinpPage =async (req,res)=>{
const banners = await Banners.find();
const deals = await Deals.find()
const approvedBanners = banners.filter((banner=>banner.approval));
const products = await Products.find()
res.json({banner:approvedBanners,products:products,deals:deals})

}



module.exports={
  filterProduct,
  filterProducts,
    getCategory,
    getItemById,
    addElectronics,
    addFashion,
    addPhoneTablet,
    addHome,
    addVehicle,
    getOfferById,
    getLandinpPage
}
