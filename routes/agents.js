const express = require('express');
const {requireJWT} = require('./../middleware/auth')
const router = express.Router();

const controller = require('./../controller/agents')

router.get('/my-profile',requireJWT,controller.agentsProfile);
router.put('/my-upload',requireJWT,controller.uploadToProfile);
router.put('/my-settings/bank',requireJWT,controller.updateBankProfile);
router.put('/my-profile',requireJWT,controller.updateBio);
router.post('/my-feedback',requireJWT,controller.agentFeedBackSubmit);




module.exports = router;
