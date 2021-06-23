/* eslint-disable prettier/prettier */
const express = require('express');
const router = express.Router();
const Loans = require('../../models/loan')

//get all loans

router.get('/all-loans', (req,res)=>{
    try {
        const allLoans = Loans.find().lean().sort({'createdAt':-1})
        return res.json({code:200,data:allLoans})
    } catch (err) {
        return res.json({code:500,message:err.message})
    }
    

})

module.exports = router;