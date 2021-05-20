/* eslint-disable prettier/prettier */
const router = require('express').Router();

router.post('/paystack_subscription', (req,res)=> {
    var event = req.body;
    console.log(event)

})

module.exports = router;