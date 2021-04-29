/* eslint-disable prettier/prettier */
const { all } = require('async');
const express = require('express');
const  User = require('../../models/User')
const router = express.Router();

//get all users of the platform
router.get('/all-users', (req,res)=>{
    try {
        const allUsers = User.find().lean().sort({'createdAt':-1})
        return res.json({code:200,data:allUsers})
    } catch (err) {
        return res.json({code:500,message:err.message})
    }
})

module.exports = router;