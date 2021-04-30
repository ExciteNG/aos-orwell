const AdbannerModel = require('../models/adBanner');
const Profiles = require('./../models/Profiles')




// 
const createAdbanner = async(req, res) => {
  const {email,userType}= req.user;
  console.log(email)
  const userProfile = await Profiles.findOne({email:email})
  const userStore = userProfile.storeInfo
  const adbanner = new AdbannerModel({
  categories: req.body.categories,
  purpose: req.body.purpose,
  banner: req.body.banner,
  approval: false,
  storeInfo:userStore,
  email:email
  })
  console.log(req.body)
  // adbanner.save()
  const upd = await adbanner.save()
  if(upd) return res.json({
        message: 'Banner posted successful!ly',
        code:201
      })
};

const updateAdbanner = (req, res) => {
  const adbannerModel = new AdbannerModel({
    _id: req.params.id,
    categories: req.body.categories,
    purpose: req.body.purpose,
    banner: req.body.banner,
    approval: req.body.approval,
    dateApproved: req.body.dateApproved,
  });
  AdbannerModel.updateOne({ _id: req.params.id }, adbannerModel)
    .then(() => {
      res.status(201).json({
        message: 'Banner updated successfully!'
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Oops! Something went wrong.',
        error
      });
    });
};

const deleteBanner = (req, res) => {
  AdbannerModel.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: 'Banner deleted!'
      })
        .catch((error) => {
          res.status(400).json({
            message: 'Oops! Something went wrong.',
            error
          });
        });
    });
};

const getOneAdbanner = (req, res) => {
  AdbannerModel.findOne({
    _id: req.params.id
  })
    .then((adBannerResponse) => {
      res.status(200).json(adBannerResponse);
    })
    .catch((error) => {
      res.status(404).json({
        message: 'Oops! Something went wrong.',
        error
      });
    });
};

const getAllAdbanners = (req, res) => {
  AdbannerModel.find()
    .then((adBannerResponse) => {
      res.status(200).json(adBannerResponse);
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Oops! Something went wrong.',
        error
      });
    });
};

module.exports = {
  getAllAdbanners,
  getOneAdbanner,
  updateAdbanner,
  deleteBanner,
  createAdbanner
}
