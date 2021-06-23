/* eslint-disable prettier/prettier */
const express = require('express');
const router = express.Router();
const Product = require('../../models/Products')

//get all products
router.get('/all-products', (req,res)=>{
    
    try {
        const allProducts = Product.find().lean().sort({'createdAt':-1})
        return res.json({code:200,data:allProducts})   
    } catch (err) {
        return res.json({code:500,message:err.message})
    }

})

module.exports = router;