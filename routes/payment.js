/* eslint-disable prettier/prettier */
const router = require('express').Router();

router.post('/paystack_subscription', (req,res)=> {
    var event = req.body;
    //tooo save payments body to db
    console.log(event)
    res.send(200)


})

module.exports = router;