/* eslint-disable no-unused-vars */
//import the twillo library
const API_KEY=process.env.API_KEY
var authy = require('authy')(API_KEY);
const router = require('express').Router();
const Loans = require('../models/loan');
const multer = require('multer');

router.get('/all', async (req,res)=>{
    try {
        let loans = await Loans.find({}).lean().sort({createdAt:-1})
        if (loans.length === 0) return res.status(404).json({empty:"You have no loan records"})
        return res.status(200).json({loans:loans})
    } catch (err) {
        console.error(err)
        res.status(500).send({error:err.message})
    }
})

router.post('/new',async (req,res)=>{
    try {
        await Loans.create(req.body)
        return res.status(201).json({success:"Created successfully"})
    } catch (err){
        console.error(err)
        res.status(500).send({error:err.message})
    }
})

module.exports = router