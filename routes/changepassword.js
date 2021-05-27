/* eslint-disable prettier/prettier */
const router = require('express').Router();
const User = require('../models/User');

router.post('/update', async (req,res) => {
    try {
        const userId = await  User.findById({id:req.user.id}).lean()
        if (!userId){
            return res.json({code:400,message:"Error processing your request, please try again"})
        }
        await userId.changePassword(req.body.oldpassword, req.body.newpassword, function(err) {
            if (err){
                if(err.name === 'IncorrectPasswordError'){
                    return res.json({ success: false, message: 'Incorrect password' }); // Return error
               }else {
                  return  res.json({ success: false, message: 'Something went wrong! Please try again later.' });
               }
            }else {
                return res.json({success:true,message:"Password changed successfully"})
            }
        })  
    } catch (err) {
        return res.json({code:500,message:err.message})
    }
})

module.exports = router;

