const express = require('express')
const Product = require("./../models/Products")

const router = express.Router()

router.get('/test',(req, res) => {
  
  //
  res.send("Welcome, server is up and running")

  })

  router.get('/search', async (req,res)=>{
    const {q} = req.query;
    console.log(q)
    const docs = await Product.find({$text: {$search: q}})
      //  .skip(20)
      //  .limit(10)
      //  .exec(function(err, docs) { 
    res.send(docs)
        // });
    // res.send(searchString)
  })

  router.get('/v2/market',async (req,res)=>{

    const products = await Product.find().limit(3);
    res.send(products)

  })

module.exports = router
