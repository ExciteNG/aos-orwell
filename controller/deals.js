const Deals = require("./../models/deals");
const Profiles = require('./../models/Profiles')
// const Deals = require('../models/deals');

const addDeals = async (req, res) => {
    const {email,userType}= req.user;
    // console.log(email)
    const userProfile = await Profiles.findOne({email:email})
    const userStore = userProfile.storeInfo
  const {
    category,
    dealImg,
    title,
    prevPrice,
    dealPrice,
    desc,
    endDate,
    subCategory,
  } = req.body;
  const percent = (dealPrice-prevPrice)*100/prevPrice
  const addDeals = new Deals({
    category: category,
    dealImg: dealImg,
    title: title,
    prevPrice: prevPrice,
    dealPrice:dealPrice,
    storeInfo:userStore,
    subCategory:subCategory,
    endDate,endDate,
    desc:desc,
    email:email,
    discnt:`${Math.round(percent)}%`
    })
  try {
    await addDeals.save();
    return res.status(201).json({ code:201,message: "success" });
  } catch (err) {
    console.error(err);
    res.send({ status: 500, message: err.message });
  }
};

module.exports = {
  addDeals,
};
