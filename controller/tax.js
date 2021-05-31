const TaxModel = require('../models/tax');

const createTax = (req, res) => {
  const {email, userType}= req.user;
  const taxModel = new TaxModel({
  payer: req.body.payer,
  address: req.body.address,
  businessNature: req.body.businessNature,
  rc: req.body.rc,
  type: req.body.type,
  payerId: req.body.payerId,
  from: req.body.from,
  to: req.body.to,
  amount: req.body.amount,
  details:req.body.reference,
  email:email,
  category:req.body.category
  });
  taxModel.save()
    .then((record) => {
      res.status(201).json({
        message: 'Tax record posted successful!ly'
      });
    })
    .catch((err) => {console.log(err)
      res.status(400).json({
        message: 'Oops! Something went wrong.',
        err
      });
    });
};

const updateTax = (req, res) => {
  const taxModel = new TaxModel({
    _id: req.params.id,
    payer: req.body.payer,
    address: req.body.address,
    businessNatue: req.body.businessNatue,
    rcNumber: req.body.rcNumber,
    taxType: req.body.taxType,
    payerId: req.body.payerId,
    fromDate: req.body.fromDate,
    fromDate: req.body.fromDate,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    amount: req.body.amount,
  });
  TaxModel.updateOne({ _id: req.params.id }, taxModel)
    .then(() => {
      res.status(201).json({
        message: 'Tax record updated successfully!'
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Oops! Something went wrong.',
        error
      });
    });
};

const deleteTax = (req, res) => {
  const checkRecord = TaxModel.findOne({_id: req.params.id});
  TaxModel.deleteOne({ _id: req.params.id })
    .then((record) => {
      if (record.deletedCount === 0) {
        res.status(404).json({
          message: "Record does not exist!"
        })
      }
      res.status(200).json({
        message: "Record deleted successfully!"
      })
        .catch((error) => {
          res.status(400).json({
            message: 'Oops! Something went wrong.',
            error
          });
        });
    });
};

const getOneTax = (req, res) => {
  TaxModel.findOne({
    _id: req.params.id
  }, (err, result) => {

    if (err || result === null) {
      return res.status(404).json({ error: "Record does not exist"})
    } else  {
      res.json({ result })
      return result
    }
  })
    .then((taxResponse) => {
      res.status(200).json(taxResponse);
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Oops! Something went wrong.',
        error
      });
    });
};

const getAllTax = (req, res) => {
  TaxModel.find()
    .then((taxResponse) => {
      res.status(200).json(taxResponse);
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Oops! Something went wrong.',
        error
      });
    });
};

module.exports = {
  getAllTax,
  getOneTax,
  updateTax,
  deleteTax,
  createTax
}
