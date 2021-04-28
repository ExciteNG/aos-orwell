const express = require('express');
const router = express.Router();
const Controller = require('../../controller/excite/payments')

router.get('/all/payments', Controller.getAllPayments);
//users
//banners approved unapprroved
//all products
//loans
//profiles

module.exports = router

