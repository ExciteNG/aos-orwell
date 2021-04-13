const express = require('express')
const { requireJWT } = require('../middleware/auth')

const router = express.Router()
const Products = require('../models/Products')
const Profiles = require('../models/Profiles')




//add product

router.post('/app/marketplace/products/add-item/electronics', requireJWT, async (req,res)=>{
    const {title,description,price,brand,subCategory,condition} = req.body
    console.log(req.body)
    const {email} = req.user

    const profile = await Profiles.findOne({email:email})
    const storeInfo=profile.storeInfo
    const priority=profile.subscriptionLevel

    const item = {title,description,price,brand,subCategory,condition,storeInfo,category:'electronics',email:email,priority}
    const newProduct = new Products(item)

    newProduct.save()

    res.json({code:201, msg:"product added"})


})

module.exports = router