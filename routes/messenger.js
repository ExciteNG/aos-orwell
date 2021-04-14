const { Timestamp } = require('bson');
const express = require('express')

const { requireJWT } = require('../middleware/auth');
const Profile = require('../models/Profiles')

const router = express.Router()

router.post('/app/v2/message',requireJWT,(req, res) => {
  const {to,subject,message,email,name} = req.body
  // console.log(req.user['_doc'])
  const sender = req.user['_doc'].name
  const senderEmail = req.user['_doc'].email
  const senderID = req.user['_doc']._id
  const messageBody = {_id:senderID,sender:sender,senderEmail:senderEmail,subject:subject,body:message,createdAt:new Date().toISOString()}

  // Profile.findByIdAndUpdate({_id:to},{messages:[messageBody]},((err,doc,result)=>{
  //   res.send(result)
  // }))
  Profile.findById(to,(err,doc)=>{
    if(err){
      return res.json({code:400})
    }
    let profile = doc
    profile.messages.push(messageBody)
    profile.save()
    res.json({code:200,message:'message sent'})
  })
  //Ensure this user a client, check client code
  // if(req.user['_doc'].userType!='CL04') return res.status(401);
  //
  // res.json({status:200,message:'you are signed in'})

  })


module.exports = router
