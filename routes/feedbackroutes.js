/* eslint-disable prettier/prettier */
const router = require('express').Router();
const feedbackControllers = require('../controller/feedback');

router.post('/enquires/complaints',feedbackControllers.feedbackEnq)
router.post('/newsletter',feedbackControllers.feedbackNews)


module.exports = router;