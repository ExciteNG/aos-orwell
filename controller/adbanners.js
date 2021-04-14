const AdbannerModel = require('../models/adBanner');

exports.createAdbanner = (req, res) => {
  const adbannerModel = new AdbannerModel({
  categories: req.body.categories,
  purpose: req.body.purpose,
  banner: req.body.banner,
  approval: req.body.approval
  });
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

exports.updateAdbanner = (req, res) => {
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

exports.deleteBanner = (req, res) => {
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

exports.getOneAdbanner = (req, res) => {
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

exports.getAllAdbanners = (req, res) => {
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
