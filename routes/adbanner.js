const {requireJWT} = require('../middleware/auth')
const express = require('express');

const router = express.Router();

const AdBannerCtrl = require('../controller/adbanners');


// AdBanner ROUTES
// post adbanners
router.post('/banner/new', requireJWT, AdBannerCtrl.createAdbanner);

// update a adbanner
router.put('/banner/:id', requireJWT, AdBannerCtrl.updateAdbanner);

// delete one adbanner
router.delete('/banner/:id', requireJWT, AdBannerCtrl.deleteBanner);

// get one adbanner by id
router.get('/banner/:id', requireJWT, AdBannerCtrl.getOneAdbanner);

// get all adbanners
router.get('/banner', requireJWT, AdBannerCtrl.getAllAdbanners);

module.exports = router;
