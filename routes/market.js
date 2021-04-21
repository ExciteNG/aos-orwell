const express = require("express");
const router = express.Router();

const { requireJWT } = require("../middleware/auth");

const Profile = require("./../models/Profiles");
const marketController = require('./../controller/market')

//Marketplace
router.post("/marketplace/store-set-up", requireJWT, async (req, res) => {
  const { vendor, phone, address, lga, state } = req.body;
  const email = req.user.email;
//   console.log(req.body);
  const profile = await Profile.findOne({ email: email });
  if (!profile) return res.status(401).json({ err: err });

//   console.log(profile);
  profile.storeInfo.storeName = vendor;
  profile.storeInfo.storePhone = phone;
  profile.storeInfo.storeAddress = address;
  profile.storeInfo.storeLga = lga;
  profile.storeInfo.storeState = state;
  // very important : telling mongoose that this field has been modified
  profile.markModified("storeInfo");
  let updatedProfile = await profile.save();
  res.json({ store: updatedProfile });

  // res.json({email})
});

//electronics
router.post('/marketplace/products/category/all',marketController.getCategory)
router.get('/marketplace/products/one/:id',marketController.getItemById)

module.exports = router;
