const express = require('express')
const moment = require('moment')
const momentTimezone = require('moment-timezone')
const { requireJWT } = require('../../../middleware/auth')
const Profile = require("./../../../models/Profiles")
const router = express.Router()


//Client Get all Employees
router.get('/app/v2/004/all-employees', requireJWT, (req,res)=>{
    const clientRef = req.user.clientRefNo;
    Profile.find({clientRefNo:clientRef},(err,doc)=>{
        if(err){

        }
        let filtered = [];
        
        for(worker of doc){
            // console.log(worker)
            let workerObj={
                name:worker.name,
                userType:worker.userType,
                employeeID:worker.employeeID,
                _id:worker._id
            }
            filtered.push(workerObj)
        }
        res.json({profiles:filtered, code:200});
    })
    // res.send('ok')
})
//Get an emplyee profile
router.get('/app/v2/004/employee/profile/:id', requireJWT, (req,res)=>{
    const clientRef = req.user.clientRefNo;
    const {id} = req.params;
    // console.log(id);

    Profile.findOne({_id:id},(err,doc)=>{
        if(err){

        }
       
        res.json({profile:doc, code:200});
    })
    // res.send('ok')
})




module.exports = router
