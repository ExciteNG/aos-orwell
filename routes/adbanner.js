const express = require('express');

const router = express.Router();

// const  require('../middleware/;

const AdBannerCtrl = require('../controller/adbanners');


// AdBanner ROUTES

// post adbanners
router.post('/banner', AdBannerCtrl.createAdbanner);

// update a adbanner
router.put('/banner/:id', AdBannerCtrl.updateAdbanner);

// delete one adbanner
router.delete('/banner/:id', AdBannerCtrl.deleteBanner);

// get one adbanner by id
router.get('/banner/:id', AdBannerCtrl.getOneAdbanner);

// get all adbanners
router.get('/banner', AdBannerCtrl.getAllAdbanners);

module.exports = router;
