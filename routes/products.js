const express = require('express')
const { requireJWT } = require('../middleware/auth')
const {PostToSocialMedia} = require('./../social/social')
const router = express.Router()
const Products = require('../models/Products')
const Profiles = require('../models/Profiles')




//add product

router.post('/app/marketplace/products/add-item/electronics', requireJWT, async (req,res)=>{
    const {title,description,price,brand,subCategory,condition} = req.body
    // console.log(req.body)
    const {email} = req.user
    const profile = await Profiles.findOne({email:email})
    const storeInfo=profile.storeInfo
    const priority=profile.subscriptionLevel

    const item = {title,description,price,brand,subCategory,condition,storeInfo,category:'electronics',email:email,priority}
    const newProduct = new Products(item)
    newProduct.save()

    if(profile.subscriptionLevel !== 3) res.json({code:201, msg:"product added"});

    // Post to social media
    const data = {title:`${title} for ${price}`, imageUrl:"https://picsum.photos/200/300"}
    const socialPosting =await PostToSocialMedia(email,data);
    if(!socialPosting) return res.json({code:400,msg:"Failed to post to social media"});
    // Posted
    res.json({code:201,msg:"posted to social",added:true});

})

module.exports = router