const express = require("express");
const { requireJWT } = require("../middleware/auth");
const { todaysDate, addMonth, addYear } = require("./../helper/date/date");
const router = express.Router();
const Payments = require("../models/Payments");
const Profiles = require("../models/Profiles");

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

    const profile = await Profiles.findOne({ email: email });

    const handleExpire = () => {
      switch (cycle) {
        case "monthly":
          return addMonth(1);
        case "yearly":
          return addYear(1);
        default:
          break;
      }
    };
    if (package === "Gold") {
      profile.subscriptionLevel = 3;
      profile.subscriptionStart = todaysDate();
      profile.subscriptionEnd = handleExpire();
      profile.save();
      //Store Payment
      const newPayment = new Payments(item);
      newPayment.save();
    }
    if (package === "Silver") {
      profile.subscriptionLevel = 2;
      profile.subscriptionStart = todaysDate();
      profile.subscriptionEnd = handleExpire();
      profile.save();
      //Store Payment
      const newPayment = new Payments(item);
      newPayment.save();
    }
    if (package === "Bronze") {
      profile.subscriptionLevel = 1;
      profile.subscriptionStart = todaysDate();
      profile.subscriptionEnd = handleExpire();
      profile.save();
      //Store Payment
      const newPayment = new Payments(item);
      newPayment.save();
    }

    //credit affiliate
    const isRef = profile.referral.isReffered;
    console.log(isRef);
    if (!isRef) return res.json({ msg: "added not reffered" });
    if (isRef && profile.referral.count === 1)
      return res.json({ msg: "reffered but count is one" });

    if (isRef && profile.referral.count === 0) {
      const isRefBy = profile.referral.refCode;
      const affiliateProfile = await Profiles.findOne({
        affiliateCode: isRefBy,
      });
    //   console.log(affiliateProfile);
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
          await profile.save();
      //  console.log(updated)
      const saved = await affiliateProfile.save()
      
     
    return res.json({ msg: "added, affiliate credited" });

      
    }

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
