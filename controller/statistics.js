
const Products = require('./../models/Products');
const Profiles = require('../models/Profiles');
const Books = require('./../models/bookkeeping')




const myStatistics = async (req,res)=>{
       const {email} = req.user
      //  console.log(email)
       const profile = await Profiles.findOne({email:email});
       const myProducts = await Products.find({email:email});
       const myBook = await Books.find({email:email})
   // console.log(profile)
       const user ={
          name:profile.fullname.split(' ')[0],
          plan:profile.subscriptionLevel
       }

      return res.json({product:myProducts.length,myBook:myBook, user})
    
}




module.exports={
   myStatistics
}