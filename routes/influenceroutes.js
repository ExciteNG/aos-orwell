const router = require('express').Router()
const {MerchantPickInfluencer,getInfluencerDashboard,influencerNegotiation,
    bargainSendInfluencer} = require('../controller/influencercontrol')

// influencer dashboard
router.get('/influencer-dashboard/:id',getInfluencerDashboard)
// merchant pick influencer for negotation
router.get('/influuencer-negotiation/:id',influencerNegotiation)
//merchant form for influencer
router.post('/merchant/get-influencer', MerchantPickInfluencer)

// merchant/influencer send message
router.post('/send-message',bargainSendInfluencer)

//get received messages either as an influencer or merchant


module.exports = router