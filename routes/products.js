/* eslint-disable standard/object-curly-even-spacing */
/* eslint-disable prettier/prettier */
const express = require('express')
const { requireJWT } = require('../middleware/auth')
const {PostToSocialMedia} = require('./../social/social')
const router = express.Router()
const { addElectronics,addFashion ,addPhoneTablet,addHome,addVehicle,addHealth, addServices} = require('../controller/market')




//add product

router.post('/app/marketplace/products/add-item/electronics', requireJWT, addElectronics)
router.post('/app/marketplace/products/add-item/fashion',requireJWT,addFashion)
router.post('/app/marketplace/products/add-item/health',requireJWT,addHealth)
router.post('/app/marketplace/products/add-item/phone&tablet',requireJWT,addPhoneTablet)
router.post('/app/marketplace/products/add-item/home-kitchen-appliance',requireJWT,addHome)
router.post('/app/marketplace/products/add-item/vehicle',requireJWT,addVehicle)
router.post('/app/marketplace/products/add-item/services',requireJWT,addServices)

module.exports = router