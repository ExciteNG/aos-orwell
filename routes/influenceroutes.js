const router = require('express').Router()
const {merchantPickInfluencer,getInfluencerDashboard,influencerNegotiation
    ,merchantDashboard,influencerAgreePrice,influencerNegotiatePrice,
    merchantNegotiateOffer,getAllChats} = require('../controller/influencercontrol')

// merchant dashboard
router.get('/merchant/dashboard/',merchantDashboard)

router.get('/influencer-dashboard/',getInfluencerDashboard)
// merchant pick influencer for negotation
router.put('/influencer-negotiation/:id',influencerNegotiation)
//merchant form for influencer
router.post('/merchant/get-influencer', merchantPickInfluencer)

//route when influencer clicks on the negotiate button
router.post('/influencer/start-negotiation/:id',influencerNegotiatePrice)
// merchant/influencer send message
router.put('/influencer-marketing/negotiation/:id',merchantNegotiateOffer)
//router.post('/send-message/:id',bargainSendInfluencer)

//merchant agree price
router.post('/merchant-agree-price',influencerAgreePrice)
//get total  chats by each 
router.get('/my-chats',getAllChats)



module.exports = router