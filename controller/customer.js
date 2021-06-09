const CustomerModel = require('../models/customer');
const Profiles = require('./../models/Profiles')

const createCustomer = async (req, res) => {
  try {
    const {email,userType}= req.user;
    // console.log(email)
    // const userProfile = await Profiles.findOne({email:email})
    // const userStore = userProfile.storeInfo
    const customer = new CustomerModel({
    customerName: req.body.customerName,
    buyersEmail: req.body.buyersEmail,
    phone: req.body.phone,
    address:req.body.address,
    buyersContact:  req.body.buyersContact,
    // storeInfo:userStore,
    // email: email
    })
    // customer.syncIndexes();
    const customerId = customer._id;
    const merchant = await Profiles.findOne({email:email});
    merchant.customers.push(customerId)
    merchant.markModified('customers');
    merchant.save();
    // console.log(req.body)
    const saveAway = await customer.save()
    if(saveAway) return res.status(201).json({
        message: 'Customer created successful!ly'
      })
    return res.status(400).json({
      message: 'Could not create customer record'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Oops! Something went wrong!',
      error
    })
  }
};

const updateCustomer = (req, res) => {
  const customerModel = new CustomerModel({
    _id: req.params.id,
    customerName: req.body.customerName,
    buyersEmail: req.body.buyersEmail,
    phone: req.body.phone,
    address:req.body.address,
    buyersContact:  req.body.buyersContact,
  });
  CustomerModel.updateOne({ _id: req.params.id }, customerModel)
    .then(() => {
      res.status(202).json({
        message: 'Record updated successfully!'
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Oops! Something went wrong.',
        error
      });
    });
};

const deleteCustomer = (req, res) => {
  CustomerModel.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: 'Reeord deleted successfully!'
      })
        .catch((error) => {
          res.status(500).json({
            message: 'Oops! Something went wrong.',
            error
          });
        });
    });
};

const getOneCustomer = (req, res) => {
  CustomerModel.findOne({
    _id: req.params.id
  })
    .then((response) => {
      res.status(200).json({
        message: 'Found record!',
        result: response
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Oops! Something went wrong.',
        error
      });
    });
};

const getAllCustomers = (req, res) => {
  CustomerModel.find()
    .then((response) => {
      res.status(200).json({
        message: 'Found records!',
        result: response
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Oops! Something went wrong.',
        error
      });
    });
};

module.exports = {
  getAllCustomers,
  getOneCustomer,
  updateCustomer,
  deleteCustomer,
  createCustomer
}
