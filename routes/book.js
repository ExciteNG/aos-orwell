const router = require('express').Router();
const Records = require('../models/bookkeeping');
const Profiles = require('../models/Profiles')
const bodyParser = require('body-parser');
const {requireJWT} = require('../middleware/auth')
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

// get all book keeping records
router.get('/all',requireJWT, async (req, res) => {
    const {email,userType} = req.user

    try {
        const records =  await Records.find({email:email})
        .sort({createdAt: 'asc' })
    .lean()
    // if (records.length === 0){
    //     return res.status(404).json({message:"no records yet"})
    // }
   return res.status(200).json({"records":records})
    }
    catch (err){
        console.error(err)
       return res.json({status:500,"error":err.message})
    }
})
// get a specific record by id
router.get('/:id', async (req,res)=>{

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

// update a new record
router.put('/:id', async (req,res) =>{

    // let hex = /[0-9A-Fa-f]{6}/g;
    // const id = (hex.test(req.params.id))? ObjectId(req.params.id) : req.params.id;
    const id = req.params.id

    try {
        let record = await Records.findById({_id:id}).lean()

    if (!record){
        res.json({status:404,message:"not found"})
   }
    else {

        let {productName,price,buyersContact,description} = req.body
        record = await Records.findByIdAndUpdate({_id:id}, req.body,{
            new: true
            // runValidators: true
        })
     }
    return res.json({status:200,update:record})

    }
    catch (err) {
        console.error(err)
       return res.send({status:500,error:err.message})
    }
})

//delete a story from the database
router.delete('/:id', async (req,res) => {

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
router.delete('/record', async (req,res) => {

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
router.post('/' ,requireJWT, async (req,res) =>{
  const {email,userType} = req.user;
  const profiles = await Profiles.findOne({email:email});

  const storeInfo = profiles.storeInfo;
    try {
        // req.body.user = req.user.id
        await Records.create({...req.body,storeInfo:storeInfo,email})
        return res.status(201).send({message:"success"})
    } catch (err) {
        console.error(err)
        res.send({status:500,message:err.message})
    }
})

module.exports = router
