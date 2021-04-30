/* eslint-disable prettier/prettier */
const express = require('express');
const router = express.Router();
const Banners = require('../../models/adBanner')

//get alll banners, aapproved or unapproved
router.get('/all-banners',(req,res)=>{
    try {
        const allBanners = Banners.find().sort({'createdAt':-1}).lean()
        return res.json({code:200,data:allBanners})
    } catch (err) {
        return res.json({status:500,data:err.message})
    }
})

module.exports = router;


