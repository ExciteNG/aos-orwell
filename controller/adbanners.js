const AdbannerModel = require('../models/adBanner');

const createAdbanner = (req, res) => {
  const {email,userType}= req.user;
  const adbannerModel = new AdbannerModel({
  categories: req.body.categories,
  purpose: req.body.purpose,
  banner: req.body.banner,
  approval: false
  })
  adbannerModel.save()
    .then((record) => {
      res.status(201).json({
        message: 'Banner posted successful!ly'
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: 'Oops! Something went wrong.',
        err
      });
    });
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
