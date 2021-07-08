const PostTransactionModel = require("../../models/transactions/postTransaction");
const Profiles = require("../../models/Profiles");
const TransactionsModel = require('../../models/transactions/transaction');
const Inventory = require('../../models/bookkeeping');


const createPostTransaction = async (req, res) => {
  console.log('post transaction req body is ', req.body);
  try {
    // const email = "vec@gmail.com";
    const {email,userType}= req.user;
    const userProfile = await Profiles.findOne({ email: email });
    const userStore = userProfile.storeInfo;
    const transactionRecord = await TransactionsModel.findOne({description: req.body.selectedTitle});
    const inventoryRecord = await Inventory.findOne({ productName: req.body.selectedTitle});

    let postTransaction = {
      account: req.body.account,
      accountType: req.body.accountType,
      postTransactionDescription: req.body.postTransactionDescription,
      selectedTitle: req.body.selectedTitle,
      amount: req.body.amount,
      paymentMode: req.body.paymentMode,
      // quantity: req.body.quantity,
      email:email
    };
    const transactionType = await TransactionsModel.findOne({description:`${req.body.selectedTitle}`});
    if (transactionType) {
      const prevTotal = transactionType.total;
      transactionType.total =prevTotal + Number(req.body.amount);
      transactionType.total + Number(req.body.inventoryPrice);
      if(inventoryRecord){
        const calcSum = inventoryRecord.price * Number(req.body.quantity);
        transactionType.productSaleSum = transactionType.productSaleSum + calcSum; 
      }
      transactionType.save();
    }
    if (!transactionType) {      
      transactionType.productSaleSum = req.body.inventoryCost;
      transactionType.total = req.body.amount;
      transactionType.save();
    }
    
    if (req.body.accountType === "income") {
      postTransaction.credit = req.body.amount;
      userProfile.incomeTotal = userProfile.incomeTotal + req.body.amount;
      userProfile.creditTotal = userProfile.creditTotal + req.body.amount;
      userProfile.markModified("incomeTotal");
      userProfile.markModified("creditTotal");
      await userProfile.save();
      postTransaction.incomeTotal = userProfile.incomeTotal;
      postTransaction.creditTotal = userProfile.creditTotal;
      const saved = new PostTransactionModel(postTransaction);
      await saved.save();
    }

    if (req.body.accountType === "expense") {
      postTransaction.debit = req.body.amount;
      userProfile.expenseTotal = userProfile.expenseTotal + req.body.amount;
      userProfile.debitTotal = userProfile.debitTotal + req.body.amount;
      userProfile.markModified("expenseTotal");
      userProfile.markModified("debitTotal");
      await userProfile.save();
      postTransaction.expenseTotal = userProfile.expenseTotal;
      postTransaction.debitTotal = userProfile.debitTotal;
      const saved = new PostTransactionModel(postTransaction);
      await saved.save();
    }

    if (req.body.accountType === "costOfSale" || req.body.inventoryCost > 0) {
      postTransaction.debit = req.body.amount;
      userProfile.costOfSaleTotal = userProfile.costOfSaleTotal + req.body.amount;
      userProfile.debitTotal = userProfile.debitTotal + req.body.amount;
      userProfile.inventoryCost = (userProfile.inventoryCost + req.body.inventoryCost) || 0;
      userProfile.markModified("costOfSaleTotal");
      userProfile.markModified("debitTotal");
      await userProfile.save();
      postTransaction.costOfSaleTotal = userProfile.costOfSaleTotal;
      postTransaction.debitTotal = userProfile.debitTotal;
      const saved = new PostTransactionModel(postTransaction);
      await saved.save();
      // res.status(201).json({message: 'Cost Debit transaction saved successfully!'});
    }
    
      res.status(201).json({message: 'Transaction saved successfully!'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Oops! Something went wrong!",
      error: error
    });
  }
};

const updatePostTransaction = (req, res) => {
  const postTransactionModel = new PostTransactionModel({
    _id: req.params.id,
    accountType: req.body.accountType,
    description: req.body.description,
  });
  PostTransactionModel.updateOne({ _id: req.params.id }, postTransactionModel)
    .then(() => {
      res.status(202).json({
        message: "Record updated successfully!",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Oops! Something went wrong.",
        error,
      });
    });
};
//
const deletePostTransaction = (req, res) => {
  PostTransactionModel.deleteOne({ _id: req.params.id }).then(() => {
    res
      .status(200)
      .json({
        message: "Reeord deleted successfully!",
      })
      .catch((error) => {
        res.status(500).json({
          message: "Oops! Something went wrong.",
          error,
        });
      });
  });
};

const getOnePostTransaction = (req, res) => {
  PostTransactionModel.findOne({
    _id: req.params.id,
  })
    .then((response) => {
      res.status(200).json({
        message: "Found record!",
        result: response,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Oops! Something went wrong.",
        error,
      });
    });
};

const getAllPostTransactions = (req, res) => {
  PostTransactionModel.find({email:req.user.email})
    .then((response) => {
      res.status(200).json({
        message: "Found records!",
        result: response,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Oops! Something went wrong.",
        error,
      });
    });
};

module.exports = {
  getAllPostTransactions,
  getOnePostTransaction,
  updatePostTransaction,
  deletePostTransaction,
  createPostTransaction,
};
