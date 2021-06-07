const express = require("express");
const { requireJWT } = require("../middleware/auth");
const { todaysDate, addMonth, addYear } = require("./../helper/date/date");
const router = express.Router();
const Payments = require("../models/Payments");
const Profiles = require("../models/Profiles");
//cron job
const cronJob = require('node-cron');

//add product

router.post(
  "/app/payment/paystack/marketplace",
  requireJWT,
  async (req, res) => {
    const { ref, amount, package, cycle } = req.body;

    //
    const { email } = req.user;
    const item = {
      ref,
      amount,
      package,
      cycle,
      email: email,
      service: "marketplace",
    };

    profile = await Profiles.findOne({ email: email });

    const handleExpire = () => {
      switch (cycle) {
        case "monthly":
          return Date.now() + 30 * 24 * 60* 60 * 1000;
        case "yearly":
          return Date.now() + 365 * 24 * 60 * 60 * 1000;
        default:
          break;
      }
    };

    if (package === "Gold") {
      profile.subscriptionLevel = 3;
      profile.subscriptionStart = Date.now()
      profile.subscriptionEnd = handleExpire()
      profile.cycle = item.cycle
      profile.markModified('subscriptionLevel');
      profile.markModified('subscriptionStart');
      profile.markModified('subscriptionEnd');
      profile.markModified('cycle')
      //Store Payment
      const newPayment = new Payments(item);
      newPayment.save();
    }
    if (package === "Silver") {
      profile.subscriptionLevel = 2;
      profile.subscriptionStart = Date.now();
      profile.subscriptionEnd = handleExpire();
      profile.cycle = item.cycle
      profile.markModified('subscriptionLevel');
      profile.markModified('subscriptionStart');
      profile.markModified('subscriptionEnd');
      profile.markModified('cycle')
      //Store Payment
      const newPayment = new Payments(item);
      newPayment.save();
    }
    if (package === "Bronze") {
      profile.subscriptionLevel = 1;
      profile.subscriptionStart = Date.now();
      profile.subscriptionEnd = handleExpire();
      profile.cycle = item.cycle
      profile.markModified('subscriptionLevel');
      profile.markModified('subscriptionStart');
      profile.markModified('subscriptionEnd');
      profile.markModified('cycle')
      //Store Payment
      const newPayment = new Payments(item);
      newPayment.save();
    }


    //credit affiliate
    const isRef = profile.referral.isReffered;
    // console.log(isRef);
    if (!isRef) {
      //save profile and return
      await profile.save();
      return res.json({code:201, msg: "added not reffered" })
    };
    if (isRef && profile.referral.count === 1){
      // save profile and return
    await profile.save();
      return res.json({ code:201, msg: "reffered but count is one" })
    };

    if (isRef && profile.referral.count === 0) {
      const isRefBy = profile.referral.refCode;
      const affiliateProfile = await Profiles.findOne({
        affiliateCode: isRefBy,
      });
      let newCommission = {
        amount: amount,
        email: email,
        package: package,
        cycle: cycle,
        commission: 0.15 * Number(amount),
      };
      affiliateProfile.earnings.push(newCommission);
      affiliateProfile.markModified("earnings");
         //change count to 1
         profile.referral = {isReffered:true, refCode:isRefBy , count:1 };
         profile.markModified("referral");
      //  console.log(updated)
      const saved = await affiliateProfile.save()
      
     

      
    }
    await profile.save();

    return res.json({code:201, msg: "added, affiliate credited" });

    //

  }
);

router.get(
  "/app/payment/paystack/get-marketplace-payments",
  requireJWT,
  async (req, res) => {
    const { userType } = req.user;

    const pays = await Payments.find();
  }
);

module.exports = router;
