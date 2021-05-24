const express = require("express");
const router = express.Router();

const { requireJWT } = require("../middleware/auth");

const Profile = require("../models/Profiles");
const marketController = require('./../controller/market')

//Marketplace
router.post("/marketplace/store-set-up", requireJWT, async (req, res) => {
  const { storeAddress, storeLga, storeName, storePhone, storeState } = req.body;
  const email = req.user.email;
  // console.log(req.user);
  const profile = await Profile.findOne({ email: email });
  if (!profile) return res.status(401).json({ err: 'profile not found' });

  // console.log(profile);
  profile.storeInfo.storeName = storeName;
  profile.storeInfo.storePhone = storePhone;
  profile.storeInfo.storeAddress = storeAddress;
  profile.storeInfo.storeLga = storeLga;
  profile.storeInfo.storeState = storeState;
  // very important : telling mongoose that this field has been modified
  profile.markModified("storeInfo");
  let updatedProfile = await profile.save();
  return res.json({code:201, store: updatedProfile.storeInfo });

  // res.json({email})
});

//get items
router.post('/marketplace/products/category/all',marketController.getCategory)
router.get('/marketplace/products/one/:id',marketController.getItemById)
router.get('/marketplace/products/offers/get/:id',marketController.getOfferById)


// get landing page item
router.get('/marketplace/landing/products/banners/offers/get',marketController.getLandinpPage)

module.exports = router;
