const PostTransactionModel = require("../../models/transactions/postTransaction");
const Profiles = require("../../models/Profiles");
const TransactionsModel = require('../../models/transactions/transaction');

const createPostTransaction = async (req, res) => {
  try {
    // const email = "vec@gmail.com";
    const {email,userType}= req.user;
    const userProfile = await Profiles.findOne({ email: email });
    // const userTransaction = userProfile.netTransaction;
    const userStore = userProfile.storeInfo;

    let postTransaction = {
      account: req.body.account,
      accountType: req.body.accountType,
      postTransactionDescription: req.body.postTransactionDescription,
      selectedTitle: req.body.selectedTitle,
      amount: req.body.amount,
      email:email
    };
    
    const transactionType = await TransactionsModel.findOne({description:`${req.body.selectedTitle}`});
    const prevTotal = transactionType.total
    transactionType.total =prevTotal + Number(req.body.amount);
    transactionType.save();

    //

    if (req.body.accountType === "income") {
      // console.log('inside income ', req.body);
      postTransaction.credit = req.body.amount;
      userProfile.incomeTotal = userProfile.incomeTotal + req.body.amount;
      userProfile.creditTotal = userProfile.creditTotal + req.body.amount;
      userProfile.markModified("incomeTotal");
      userProfile.markModified("creditTotal");
      await userProfile.save();
      // postTransaction.incomeTotal = userProfile.incomeTotal + req.body.amount;
      postTransaction.incomeTotal = userProfile.incomeTotal;
      postTransaction.creditTotal = userProfile.creditTotal;
      const saved = new PostTransactionModel(postTransaction);
      await saved.save();
      res.status(201).json({message: 'Credit transaction saved successfully!'});
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
      res.status(201).json({message: 'Debit transaction saved successfully!'});
    }

    if (req.body.accountType === "costOfSale") {
      postTransaction.debit = req.body.amount;
      userProfile.costOfSaleTotal = userProfile.costOfSaleTotal + req.body.amount;
      userProfile.debitTotal = userProfile.debitTotal + req.body.amount;
      userProfile.markModified("costOfSaleTotal");
      userProfile.markModified("debitTotal");
      await userProfile.save();
      postTransaction.costOfSaleTotal = userProfile.costOfSaleTotal;
      postTransaction.debitTotal = userProfile.debitTotal;
      const saved = new PostTransactionModel(postTransaction);
      await saved.save();
      res.status(201).json({message: 'Cost Debit transaction saved successfully!'});
    }

    // const saved = postTransaction.save();
    // if (saved) return res.status(201).json({message: 'Transaction created successfully!'});
    // return res.status(400).json({message: 'Could not create Transaction!'});
  } catch (error) {
    res.status(500).json({
      message: "Oops! Something went wrong!",
      error,
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
  PostTransactionModel.find()
    .then((response) => {
      console.log("response ", response);
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
