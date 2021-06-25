const router = require('express').Router()
const approveInfluencer = require('../../controller/excite/influencerrs');

router.post('/approve-influencer/:id',approveInfluencer)

module.exports = router;