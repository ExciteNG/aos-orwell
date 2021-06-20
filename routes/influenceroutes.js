const router = require('express').Router()
const {MerchantPickInfluencer,getInfluencerDashboard} = require('../controller/influencercontrol')

router.get('/influencer-dashboard/:id',getInfluencerDashboard)
router.post('/merchant/get-influencer', MerchantPickInfluencer)

module.exports = router