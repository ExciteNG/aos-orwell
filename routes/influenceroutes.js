const router = require('express').Router()
const {MerchantPickInfluencer,getInfluencerDashboard,influencerNegotiation
    ,merchantDashboard,influencerAgreePrice,influencerNegotiatePrice,
    merchantNegotiateOffer} = require('../controller/influencercontrol')

// influencer dashboard
router.get('/merchant/dashboard/:id',merchantDashboard)

router.get('/influencer-dashboard/:id',getInfluencerDashboard)
// merchant pick influencer for negotation
router.put('/influencer-negotiation/:id',influencerNegotiation)
//merchant form for influencer
router.post('/merchant/get-influencer', MerchantPickInfluencer)

//route when influencer clicks on the negotiate button
router.post('/influencer/start-negotiation/:id',influencerNegotiatePrice)
// merchant/influencer send message
router.put('/influencer-marketing/negotiation/:id',merchantNegotiateOffer)
//router.post('/send-message/:id',bargainSendInfluencer)

//merchant agree price
router.post('/merchant-agree-price',influencerAgreePrice)
//get received messages either as an influencer or merchant



module.exports = router