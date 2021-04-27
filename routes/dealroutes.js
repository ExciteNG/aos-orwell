/* eslint-disable prettier/prettier */
const router = require('express').Router();
const Deals = require('../models/deals');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');


const s3 = new AWS.S3({
    credentials: {  
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region:process.env.AWS_S3_REGION_NAME
    }
})

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({storage}).single('image')

router.get('/all',async (req, res) => {

    try {
        const deals =  await Deals.find({approved:true})
    .sort({createdAt: -1})
    .lean()
    if (deals.length === 0){
        return res.json({status:404,message:"you have no deals yet"})
    }
   return res.status(200).json({"deals":deals})
    }
    catch (err){
        console.error(err)
       return res.json({status:500,"error":err.message})
    }
})

// get a specific deal by id
router.get('/deal/:id', async (req,res)=>{

    const id = req.params.id
    try {
        const dealsId = await Deals.findById({_id:id})
        if (!dealsId){
            return res.send({status:404,message:"not found"})
        }
        return res.status(200).json({record:dealsId})
        
    } catch (err) {
        console.error(err)
        res.json({status:500,error:err.message})
    }
})

// update a deal
router.put('/deal/:id',upload, async (req,res) =>{

    // let hex = /[0-9A-Fa-f]{6}/g;
    // const id = (hex.test(req.params.id))? ObjectId(req.params.id) : req.params.id;
    const id = req.params.id
    
    try {
        let deal = await Deals.findById({_id:id}).lean()

    if (!deal){
        res.json({status:404,message:"not found"})
   }
    else {
        
        let {productName,category,target,previousPrice,DealPrice,buyersContact,DealEnds,Description,image} = req.body
        deal = await Deals.findByIdAndUpdate({_id:id}, req.body,{
            new: true
            // runValidators: true
        })
     }
    return res.json({status:500,update:deal})

    }
    catch (err) {
        console.error(err)
       return res.send({status:500,error:err.message})
    }
})

//delete a story from the database
router.delete('/delete/:id', async (req,res) => {

    const id = req.params.id
    
    try {
        let deals = await Deals.findById({_id:id}).lean()
  
        if (!deals) {
          return res.send({status:404,message:"deal not found"})
        } else {
        await Deals.remove({_id:id})
       return  res.status(200).send({message:"Deal successfully deleted !"})
          }
        
    } catch (err) {
        console.error(err)
        return res.send({status:500,error:err.message}) 
    }
})

// delete all records
router.delete('/delete/all', async (req,res) => {

    const id = req.params.id
    
    try {
        let deals = await Deals.find().lean()
        if (deals.length===0) {
          return res.send({status:404,message:"deals not found"})
        } else {
        await deals.deleteMany()
       return  res.status(200).send({message:"Wipedown of all deals complete and successful !"})
    }
        
    } catch (err) {
        console.error(err)
        return res.send({status:500,error:err.message}) 
    }
})

//post a new deal
// add a new record
router.post('/new', async (req,res) =>{
    const id = req.params.id
    try {
        // req.body.user = req.user.id
        await Deals.create(req.body)
        return res.status(201).send({message:"success"})
    } catch (err) {
        console.error(err)
        res.send({status:500,message:err.message})
    }
})





module.exports = router

