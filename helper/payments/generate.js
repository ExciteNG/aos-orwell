const express = require("express");
const { requireJWT } = require("./../../middleware/auth");
const router = express.Router();
const jwt = require("jsonwebtoken");
const plans = require("./plans");
const verify = require("./verify");
const Profiles = require("./../../models/Profiles")
const Payments = require("./../../models/Payments")

router.get("/generate-payment", requireJWT, (req, res) => {
  // console.log(req.query.item)
  const { email } = req.user;
  try {
    const details = plans[req.query.item];
    if (!details) return res.status(404).json({ msg: "not found" });
    details.email = email;
    console.log(details);

    const token = jwt.sign(details, process.env.PAY_TOKEN_SECRET, {
      expiresIn: 10000,
    });

    return res.send(token);
  } catch (error) {
    return res.status(500).json({ msg: "bad request" });
  }
});

router.post("/confirm/subscription",verify, async (req, res) => {
    const { email,amount,name ,cycle} = req.plan;
    const package=name;
    const item = { ...req.plan, package: name,ref:req.body.ref };
    try {
      const profile = await Profiles.findOne({ email: email });
        // console.log(profile)
      const handleExpire = () => {
        switch (cycle) {
          case "Monthly":
            return Date.now() + 30 * 24 * 60 * 60 * 1000;
          case "Yearly":
            return Date.now() + 365 * 24 * 60 * 60 * 1000;
          default:
            break;
        }
      };

      if (package === "Gold") {
        profile.subscriptionLevel = 3;
        profile.subscriptionStart = Date.now();
        profile.subscriptionEnd = handleExpire();
        profile.cycle = item.cycle;
        profile.markModified("subscriptionLevel");
        profile.markModified("subscriptionStart");
        profile.markModified("subscriptionEnd");
        profile.markModified("cycle");
        //Store Payment
        const newPayment = new Payments(item);
        newPayment.save();
      }
      if (package === "Silver") {
        profile.subscriptionLevel = 2;
        profile.subscriptionStart = Date.now();
        profile.subscriptionEnd = handleExpire();
        profile.cycle = item.cycle;
        profile.markModified("subscriptionLevel");
        profile.markModified("subscriptionStart");
        profile.markModified("subscriptionEnd");
        profile.markModified("cycle");
        //Store Payment
        const newPayment = new Payments(item);
        newPayment.save();
      }
      if (package === "Bronze") {
        profile.subscriptionLevel = 1;
        profile.subscriptionStart = Date.now();
        profile.subscriptionEnd = handleExpire();
        profile.cycle = item.cycle;
        profile.markModified("subscriptionLevel");
        profile.markModified("subscriptionStart");
        profile.markModified("subscriptionEnd");
        profile.markModified("cycle");
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
        return res.json({ code: 201, msg: "added not reffered" });
      }
      if (isRef && profile.referral.count === 1) {
        // save profile and return
        await profile.save();
        return res.json({ code: 201, msg: "reffered but count is one" });
      }

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
        profile.referral = { isReffered: true, refCode: isRefBy, count: 1 };
        profile.markModified("referral");
        //  console.log(updated)
        const saved = await affiliateProfile.save();
      }
      await profile.save();

      return res.json({ code: 201, msg: "added, affiliate credited" });
    } catch (error) {
      console.log(error);
    }
    //
});

module.exports = router;
