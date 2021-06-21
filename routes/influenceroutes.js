const router = require('express').Router()
const {MerchantPickInfluencer,getInfluencerDashboard,influencerNegotiation} = require('../controller/influencercontrol')

router.get('/influencer-dashboard/:id',getInfluencerDashboard)
router.get('/influuencer-negotiation/:id',influencerNegotiation)
router.post('/merchant/get-influencer', MerchantPickInfluencer)


module.exports = router