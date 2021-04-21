
const Products = require('./../models/Products');
const Profiles = require('./../models/Profiles');
const Books = require('./../models/bookkeeping')




const myStatistics = async (req,res)=>{
       const {email} = req.user
    //    const profile = await Profiles.findOne({email:email});
       const myProducts = await Products.find({email:email});
       const myBook = await Books.find({email:email})

       res.json({product:myProducts.length,myBook:myBook})
    
}




module.exports={
   myStatistics
}