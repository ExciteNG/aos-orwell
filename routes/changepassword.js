/* eslint-disable prettier/prettier */
const router = require('express').Router();
const User = require('../models/User');
const {requireJWT} = require('../middleware/auth')

router.post('/update', requireJWT, async (req,res) => {
    const {email} = req.user
    // console.log(email)
    try {
        const userId = await  User.findOne({email:email})
        // console.log(userId)
        if (!userId){
            return res.json({code:400,message:"Error processing your request, please try again"})
        }
        await userId.changePassword(req.body.oldPassword, req.body.newPassword, function(err) {
            if (err){
                if(err.name === 'IncorrectPasswordError'){
                    return res.json({ code: 401, message: 'Incorrect password' }); // Return error
               }else {
                  return  res.json({ code: 404, message: 'Something went wrong! Please try again later.' });
               }
            }else {
                return res.json({code:200,message:"Password changed successfully"})
            }
        })  
    } catch (err) {
        return res.status(500).json({code:500,message:err.message})
    }
})

module.exports = router;