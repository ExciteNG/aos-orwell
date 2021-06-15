const BalanceModel = require("../models/balance");
const Profiles = require("./../models/Profiles");

const createBalance = async (req, res) => {
  try {
    // const email = "vec@gmail.com";
    const {email,userType}= req.user;
    // console.log(email)
    const userProfile = await Profiles.findOne({ email: email });
    const userBalance = userProfile.netBalance;
    const userStore = userProfile.storeInfo;
    // const balance = new BalanceModel({
    // typeOFBalance: req.body.typeOFBalance,
    // account: req.body.account,
    // categoryOfBalance: req.body.categoryOfBalance,
    // amount: req.body.amount,
    // credit: req.body.credit,
    // debit: req.body.debit,
    // description:  req.body.description,
    // recordBalance: req.body.recordBalance
    // });
    let balance = {
      typeOFBalance: req.body.typeOFBalance,
      account: req.body.account,
      categoryOfBalance: req.body.categoryOfBalance,
      amount: req.body.amount,
      description: req.body.description,
      customerEmail: req.body.customerEmail,
      email:email
    };

    if (req.body.categoryOfBalance === "credit") {
      console.log("inside credit ", req.body);
      // req.body.balance  = req.body.balance + req.body.credit;
      balance.credit = req.body.amount;
      userProfile.netBalance = userBalance + req.body.amount;
      userProfile.markModified("netBalance");
      await userProfile.save();
      balance.recordBalance = userBalance + req.body.amount;
      const saved = new BalanceModel(balance);
      await saved.save();
      res.status(201).json({message: 'Credit record saved successfully!'});
    } else {
      balance.debit = req.body.amount;
      userProfile.netBalance = userBalance - req.body.amount;
      userProfile.markModified("netBalance");
      await userProfile.save();
      balance.recordBalance = userBalance - req.body.amount;
      const saved = new BalanceModel(balance);
      await saved.save();
      res.status(201).json({message: 'Debit record saved successfully!'});
    }

    // console.log(balance)
    // const saveAway = new BalanceModel(balance);
    //  const done = await saveAway.save()
    // if(done) return res.status(201).json({
    //     message: 'Balance record created successful!ly'
    //   })
    // return res.status(400).json({
    //   message: 'Could not create balance record'
    // })
  } catch (error) {
    res.status(500).json({
      message: "Oops! Something went wrong!",
      error,
    });
  }
};

const updateBalance = (req, res) => {
  const balanceModel = new BalanceModel({
    _id: req.params.id,
    typeOFBalance: req.body.typeOFBalance,
    account: req.body.account,
    debit: req.body.debit,
    credit: req.body.credit,
    balance: req.body.balance,
    description: req.body.description,
    customerEmail: req.body.customerEmail
  });
  BalanceModel.updateOne({ _id: req.params.id }, balanceModel)
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

const deleteBalance = (req, res) => {
  BalanceModel.deleteOne({ _id: req.params.id }).then(() => {
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

const getOneBalance = (req, res) => {
  BalanceModel.findOne({
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

const getAllBalances = (req, res) => {
  BalanceModel.find()
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
  getAllBalances,
  getOneBalance,
  updateBalance,
  deleteBalance,
  createBalance,
};

// const BalanceModel = require('../models/balance');
// const Profiles = require('./../models/Profiles')
//
// const createBalance = async (req, res) => {
//   try {
//     const email = "vec@gmail.com"
//     // const {email,userType}= req.user;
//     // console.log(email)
//     // const userProfile = await Profiles.findOne({email:email})
//     // const userStore = userProfile.storeInfo
//     // const balance = new BalanceModel({
//     // typeOFBalance: req.body.typeOFBalance,
//     // account: req.body.account,
//     // categoryOfBalance: req.body.categoryOfBalance,
//     // amount: req.body.amount,
//     // description:  req.body.description,
//     // // debit: null,
//     // // credit:null,
//     // // recordBalance: null
//     // // storeInfo:userStore,
//     // // email: email
//     // })
//     const merchantPrevRecord = await BalanceModel.findOne({merchant:email});
//
//     const balance = {
//       typeOFBalance: req.body.typeOFBalance,
//       account: req.body.account,
//       categoryOfBalance: req.body.categoryOfBalance,
//       amount: req.body.amount,
//       description:  req.body.description,
//       merchant:email
//     }
//     if(!merchantPrevRecord){
//       const newBal = new BalanceModel(balance);
//       // await newBal.save();
//       // return res.send('saved first time');
//     }
//     // balance.syncIndexes();
//
//     // const credit = req.body.credit
//     // balance.credit =
//
//     if(req.body.categoryOfBalance === 'credit') {
//       console.log('inside credit ', req.body);
//       // req.body.balance  = req.body.balance + req.body.credit;
//       balance.credit  = req.body.amount;
//       merchantPrevRecord.recordBalance  =  merchantPrevRecord.recordBalance + req.body.amount;
//       await merchantPrevRecord.save()
//
//       console.log('balance ', balance);
//     } else {
//       console.log('inside debit ', req.body);
//       balance.debit  = merchantPrevRecord.debit + req.body.amount;
//       balance.recordBalance  +=  merchantPrevRecord.debit;
//     }
//
//
//     // if(req.body.credit != null) {
//     //   console.log('inside credit ', req.body);
//     //   req.body.balance  = req.body.balance + req.body.credi;
//     // } else {
//     //   console.log('inside debit ', req.body);
//     //   req.body.balance = req.body.balance - req.body.debit;
//     // }
//
//     // const balanceId = balance._id;
//     // const merchant = await Profiles.findOne({email:email});
//     // merchant.balances.push(balanceId)
//     // merchant.markModified('balances');
//     // merchant.save();
//
//     console.log(balance)
//     const saveAway = new BalanceModel(balance);
//      const done = await saveAway.save()
//     if(done) return res.status(201).json({
//         message: 'Balance record created successful!ly'
//       })
//     return res.status(400).json({
//       message: 'Could not create balance record'
//     })
//   } catch (error) {
//     res.status(500).json({
//       message: 'Oops! Something went wrong!',
//       error
//     })
//   }
// };
//
// const updateBalance = (req, res) => {
//   const balanceModel = new BalanceModel({
//     _id: req.params.id,
//     typeOFBalance: req.body.typeOFBalance,
//     account: req.body.account,
//     debit: req.body.debit,
//     credit:req.body.credit,
//     balance:  req.body.balance,
//     description:  req.body.description
//   });
//   BalanceModel.updateOne({ _id: req.params.id }, balanceModel)
//     .then(() => {
//       res.status(202).json({
//         message: 'Record updated successfully!'
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: 'Oops! Something went wrong.',
//         error
//       });
//     });
// };
//
// const deleteBalance = (req, res) => {
//   BalanceModel.deleteOne({ _id: req.params.id })
//     .then(() => {
//       res.status(200).json({
//         message: 'Reeord deleted successfully!'
//       })
//         .catch((error) => {
//           res.status(500).json({
//             message: 'Oops! Something went wrong.',
//             error
//           });
//         });
//     });
// };
//
// const getOneBalance = (req, res) => {
//   BalanceModel.findOne({
//     _id: req.params.id
//   })
//     .then((response) => {
//       res.status(200).json({
//         message: 'Found record!',
//         result: response
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: 'Oops! Something went wrong.',
//         error
//       });
//     });
// };
//
// const getAllBalances = (req, res) => {
//   BalanceModel.find()
//     .then((response) => {
//       res.status(200).json({
//         message: 'Found records!',
//         result: response
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: 'Oops! Something went wrong.',
//         error
//       });
//     });
// };
//
// module.exports = {
//   getAllBalances,
//   getOneBalance,
//   updateBalance,
//   deleteBalance,
//   createBalance
// }
