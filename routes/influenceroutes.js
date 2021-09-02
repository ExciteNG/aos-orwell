const router = require('express').Router();
const {merchantPickInfluencer,
    getInfluencerDashboard,
    influencerNegotiation,
    merchantDashboard,
    merchantPaymentPrice,
    influencerNegotiatePrice,
    merchantNegotiateOffer,
    getAllChats,
    influencerMerchantDeclinePrice,
    influencerAcceptsPrice,
    singleChat,
   // merchantDeclinePendings,
    getMerchantPendings,
    getMerchantAccepted,
    getMerchantCompleted,
    getInfluencerPendings,
    getInfluencerAccepted,
    getInfluencerCompleted} = require('../controller/influencercontrol')

const {requireJWT} = require('./../middleware/auth')
//merchant form for influencer
router.post('/merchant/get-influencer',requireJWT, merchantPickInfluencer)

router.get('/influencer-dashboard',requireJWT,getInfluencerDashboard)

// merchant pick influencer for negotation
router.put('/influencer-negotiation/:id',requireJWT,influencerNegotiation)

// merchant dashboard
router.get('/merchant/dashboard',requireJWT,merchantDashboard)

// get a list of merchant pending jobs
// router.get('/merchant/pending-jobs', requireJWT, merchantDeclinePendings)

//merchant agree price
router.post('/merchant-agree-price',requireJWT,merchantPaymentPrice)

//route when influencer clicks on the negotiate button
router.post('/influencer/start-negotiation/:id',requireJWT,influencerNegotiatePrice)
// merchant/influencer send message
router.put('/influencer-marketing/negotiation/:id',requireJWT,merchantNegotiateOffer)
//router.post('/send-message/:id',bargainSendInfluencer)

//get specific chats
router.get('/negotiation-chat/:id',requireJWT,singleChat)
//get total  chats by each 
router.get('/my-chats', requireJWT, getAllChats)

//influencer decline offer
router.delete('/merchant/influencer-decline/:id', requireJWT, influencerMerchantDeclinePrice)

//influencer accept offer
router.put("/influencer-accept/:id",requireJWT,influencerAcceptsPrice)

//get merchant pendings
router.get('/merchant-pendings', requireJWT, getMerchantPendings)
//get merchant ongoing
router.get('/merchant-ongoing', requireJWT, getMerchantAccepted)
//get merchant complete
router.get('/merchant-complete', requireJWT, getMerchantCompleted)

// get influencer pendings
router.get('/influencer-pendings', requireJWT, getInfluencerPendings)
// get influencer ongoing
router.get('/influencer-ongoing', requireJWT, getInfluencerAccepted)
// get influencer complete
router.get('/influencer-complete', requireJWT, getInfluencerCompleted)

module.exports = router