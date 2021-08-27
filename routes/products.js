/* eslint-disable standard/object-curly-even-spacing */
/* eslint-disable prettier/prettier */
const express = require('express')
const { requireJWT } = require('../middleware/auth')
const {PostToSocialMedia} = require('./../social/social')
const router = express.Router()
const { addElectronics,addFashion ,addPhoneTablet,addHome,addVehicle,addHealth,addAgro, addServices, addProperty, addKids,delMyProduct,updateMyProduct, addLaptops} = require('../controller/market')




//add product

router.post('/app/marketplace/products/add-item/electronics', requireJWT, addElectronics)
router.post('/app/marketplace/products/add-item/laptops-acc', requireJWT, addLaptops)
router.post('/app/marketplace/products/add-item/fashion',requireJWT,addFashion)
router.post('/app/marketplace/products/add-item/health',requireJWT,addHealth)
router.post('/app/marketplace/products/add-item/phone&tablet',requireJWT,addPhoneTablet)
router.post('/app/marketplace/products/add-item/home-kitchen-appliance',requireJWT,addHome)
router.post('/app/marketplace/products/add-item/vehicle',requireJWT,addVehicle)
router.post('/app/marketplace/products/add-item/services',requireJWT,addServices)
router.post('/app/marketplace/products/add-item/agro',requireJWT,addAgro)
router.post('/app/marketplace/products/add-item/property',requireJWT,addProperty)
router.post('/app/marketplace/products/add-item/kiddies',requireJWT,addKids)
router.delete('/app/marketplace/products/delete-item/:id',requireJWT,delMyProduct)
router.put('/app/marketplace/products/update-item/:id',requireJWT,updateMyProduct)

module.exports = router