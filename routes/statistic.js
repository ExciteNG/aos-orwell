const {requireJWT} = require('../middleware/auth')
const express = require('express');

const router = express.Router();

const statisticCtrl = require('../controller/statistics');



router.get('/my-profile-statistic',requireJWT, statisticCtrl.myStatistics);



module.exports = router;
