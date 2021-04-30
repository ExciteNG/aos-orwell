/* eslint-disable prettier/prettier */
const express = require('express');
const router = express.Router();
const Controller = require('../../controller/excite/banners')



//get alll banners, aapproved or unapproved
router.get('/get-all', Controller.getAllBanners)

// 
router.post('/approve/banner/:id', Controller.approveBanner)

module.exports = router;


