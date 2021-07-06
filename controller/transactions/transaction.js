const TransactionModel = require("..//../models/transactions/transaction");
const Profiles = require("../../models/Profiles");
const Inventory = require("../../models/bookkeeping");

const createTransaction = async (req, res) => {
  try {
    // const email = "vec@gmail.com";
    const {email,userType}= req.user;
    const userProfile = await Profiles.findOne({ email: email });
    const userStore = userProfile.storeInfo;

    let {description} = req.body;
    const inventoryRecord = await Inventory.findOne({productName: description});
    const transactionType = await TransactionModel.findOne({description:`${req.body.description}`});
    if(transactionType){
      console.log('transaction exists');
      return res.status(200).json({message: "transaction already exists."})
    }

    const transaction = new TransactionModel({
      accountType: req.body.accountType,
      description: req.body.description,
      productSaleSum: req.body.productSaleSum,
      // inventoryCost: req.body.inventoryCost,
      email:email,
      merchant:email,
    });
    
    if(req.body.inventoryCost > 0){
      transaction.inventoryCost = req.body.inventoryCost;
      // inventoryRecord.save();
      transaction.save();
    }

    const saved = transaction.save();
    if (saved) return res.status(201).json({message: 'Transaction created successfully!'});
    return res.status(400).json({message: 'Could not create Transaction!'});
  } catch (error) {
    console.log('error msg ', error);
    res.status(500).json({
      message: "Oops! Something went wrong!",
      error,
    });
  }
};

const updateTransaction = (req, res) => {
  const transactionModel = new TransactionModel({
    _id: req.params.id,
    accountType: req.body.accountType,
    description: req.body.description,
  });
  TransactionModel.updateOne({ _id: req.params.id }, transactionModel)
    .then(() => {
      res.status(202).json({
        message: "Record updated successfully!",
      });
    })
    .catch((error) => {
      console.log('error msg ', error);
      res.status(500).json({
        message: "Oops! Something went wrong.",
        error,
      });
    });
};

const deleteTransaction = (req, res) => {
  TransactionModel.deleteOne({ _id: req.params.id }).then(() => {
    res
      .status(200)
      .json({
        message: "Reeord deleted successfully!",
      })
      .catch((error) => {
        console.log('error msg ', error);
        res.status(500).json({
          message: "Oops! Something went wrong.",
          error,
        });
      });
  });
};

const getOneTransaction = (req, res) => {
  TransactionModel.findOne({
    _id: req.params.id,
  })
    .then((response) => {
      res.status(200).json({
        message: "Found record!",
        result: response,
      });
    })
    .catch((error) => {
      console.log('error msg ', error);
      res.status(500).json({
        message: "Oops! Something went wrong.",
        error,
      });
    });
};

const getAllTransactions = (req, res) => {
  TransactionModel.find()
    .then((response) => {
      // console.log("response ", response);
      res.status(200).json({
        message: "Found records!",
        result: response,
      });
    })
    .catch((error) => {
      console.log('error msg ', error);
      res.status(500).json({
        message: "Oops! Something went wrong.",
        error,
      });
    });
};

module.exports = {
  getAllTransactions,
  getOneTransaction,
  updateTransaction,
  deleteTransaction,
  createTransaction,
};