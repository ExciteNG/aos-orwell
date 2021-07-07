const router = require('express').Router();
const Records = require('../models/salesBook');
const Books = require('../models/bookkeeping');
const Profiles = require('../models/Profiles');
const bodyParser = require('body-parser');
const {requireJWT} = require('../middleware/auth')
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

// get all sales records
router.get('/all', requireJWT, async (req, res) => {
    const {email,userType} = req.user

    try {
        const records =  await Records.find({email:email})
        .sort({createdAt: 'asc' })
    .lean()
   return res.status(200).json({"records":records})
    }
    catch (err){
        console.error(err)
       return res.json({status:500,"error": err.message})
    }
})

// get a specific record by id
router.get('/:id', requireJWT, async (req,res)=>{
    const id = req.params.id
    try {
        const storeId = await Records.findById({_id:id})
        if (!storeId){
            return res.send({status:404,message:"not found"})
        }
        return res.status(200).json({record:storeId})

    } catch (err) {
        console.error(err)
        res.json({status:500,error:err.message})
    }
})

// get a specific record by product name
router.get('/name/:id', requireJWT, async (req,res)=>{
    const productName = req.params.id
    try {
        const storeId = await Records.find({productName:productName})
        if (storeId.length < 1){
            return res.send({status:404,message:"not found"})
        }
        return res.status(200).json({record:storeId})

    } catch (err) {
        console.error(err)
        res.json({status:500,error:err.message})
    }
})

// update record by product name
router.put('/name/:id', requireJWT, async (req,res) =>{
    const productName = req.params.id
    try {
        let record = await Records.find({productName:productName}).lean()
    if (record.length < 1){
      return  res.json({status:404, message:"not found"});
   }
    else {
        let {productName, price, buyersContact, description} = req.body
        record = await Records.find({productName:productName}, req.body,{
            new: true
        })
     }
    return res.json({ status:200, update:record})
    }
    catch (err) {
        console.error(err)
       return res.send({status:500, error: err.message})
    }
})


// update a new record
router.put('/:id', requireJWT, async (req,res) =>{
    const id = req.params.id
    try {
        let record = await Records.findById({_id:id}).lean()
    if (!record){
        res.json({status:404,message:"not found"})
   }
    else {
        let {productName, price, buyersContact, description} = req.body
        record = await Records.findByIdAndUpdate({_id:id}, req.body,{
            new: true
        })
     }
    return res.json({ status:200, update:record})
    }
    catch (err) {
        console.error(err)
       return res.send({status:500, error: err.message})
    }
})

//delete a sale
router.delete('/:id', requireJWT, async (req,res) => {
    const id = req.params.id

    try {
        let record = await Records.findById({_id:id}).lean()

        if (!record) {
          return res.send({status:404,message:"not found"})
        } else {
        await Records.remove({_id:id})
       return  res.status(200).send({message:"Delete successful !"})
          }
    } catch (err) {
        console.error(err)
        return res.send({status:500,error:err.message})
    }
})

// delete all records
router.delete('/record', requireJWT, async (req,res) => {
    const id = req.params.id

    try {
        let record = await Records.find().lean()
        if (record.length===0) {
          return res.send({status:404,message:"records not found"})
        } else {
        await Records.deleteMany()
       return  res.status(200).send({message:"Wipedown complete and successful !"})
    }
    } catch (err) {
        console.error(err)
        return res.send({status:500,error:err.message})
    }
})

// add a new record
router.post('/new' , requireJWT, async (req,res) =>{
  const {email,userType} = req.user;
  const profiles = await Profiles.findOne({email:email});
  const storeInfo = profiles.storeInfo;
    try {
        const thisSales=req.body;
        // let record = await Books.findOne({_id:req.body.salesRef})
       delete thisSales._id;

       // ******** Consider TODO ***********
       // import book keeping and update the record  for  store, orders and sales on backend.
       // Also remove the record update on frontend that uses modifiedData,qtySold etc

        await Records.create({
          ...thisSales,
          storeInfo:storeInfo,
          email
        })
        return res.status(201).send({message:"success"})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: err.message})
    }
})

module.exports = router
