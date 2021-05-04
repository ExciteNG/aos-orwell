/* eslint-disable prettier/prettier */
const express = require('express');
const router = express.Router();
const allDeals = require('../../models/deals');


router.get('/all-excite-deals',(req,res)=>{
    try {
        const deals = allDeals.find().sort({'createdAt':-1}).lean()
        return res.json({code:200,data:deals})
    } catch (err) {
        return res.json({code:500,err:err.message})
    }
})