/* eslint-disable prettier/prettier */
const router = require('express').Router();
const Kiosk = require('../models/kiosk');

//crud routes for the  kiosk
router.get('/kiosk-all',async (req, res) => {

    try {
        const kiosks =  await Kiosk.find().sort({'createdAt':-1})
    .sort({createdAt: -1})
    .lean()
    if (kiosks.length === 0){
        return res.json({status:404,message:"you have no kiosks yet"})
    }
   return res.status(200).json({"kiosks":kiosks})
    }
    catch (err){
        console.error(err)
       return res.json({status:500,"error":err.message})
    }
})



// get a specific kiosks by id
router.get('/kiosk/:id', async (req,res)=>{

    const id = req.params.id
    try {
        const kioskId = await Kiosk.findById({_id:id})
        if (!kioskId){
            return res.send({status:404,message:"not found"})
        }
        return res.status(200).json({kiosk:kioskId})
        
    } catch (err) {
        console.error(err)
        res.json({status:500,error:err.message})
    }
})

// update a kiosk
router.put('/kiosk-update/:id', async (req,res) =>{

    // let hex = /[0-9A-Fa-f]{6}/g;
    // const id = (hex.test(req.params.id))? ObjectId(req.params.id) : req.params.id;
    const id = req.params.id
    
    try {
        let kioskupdates = await Kiosk.findById({_id:id}).lean()

    if (!kioskupdates){
        res.json({status:404,message:"not found"})
   }
    else {
        // ody
        // let {productName,category,target,previousPrice,DealPrice,buyersContact,DealEnds,Description,image} = req.b
        let kioskupdates = await Kiosk.findByIdAndUpdate({_id:id}, req.body,{
            new: true
            // runValidators: true
        });
     }
    return res.json({status:500,update:kioskupdates})

    }
    catch (err) {
        console.error(err)
       return res.send({status:500,error:err.message})
    }
})

//delete a kiosk from the database
router.delete('/delete-kiosk/:id', async (req,res) => {

    const id = req.params.id
    
    try {
        let kiosks = await Kiosk.findById({_id:id}).lean()
  
        if (!kiosks) {
          return res.send({status:404,message:"kiosk not found"})
        } else {
        await Kiosk.remove({_id:id})
       return  res.status(200).send({message:"Kiosk successfully deleted !"})
          }
        
    } catch (err) {
        console.error(err)
        return res.send({status:500,error:err.message}) 
    }
})

//post a new kiosk
// add a new record
router.post('/new-kiosk', async (req,res) =>{
    const id = req.params.id
    try {
        // req.body.user = req.user.id
        await Kiosk.create(req.body)
        return res.status(201).send({message:"success"})
    } catch (err) {
        console.error(err)
        res.send({status:500,message:err.message})
    }
})

// delete all kiosks
router.delete('/delete-all-kiosk', async (req,res) => {
    
    try {
        let kiosk = Kiosk.find().lean()
        if (kiosk.length===0) {
          return res.send({status:404,message:"kiosks not found"})
        } else {
        await kiosk.remove({})
        return res.send({status:200,message:"wipedown of all kiosks complete and successful !"})
    }
        
    } catch (err) {
        console.error(err)
        return res.send({status:500,error:err.message}) 
    }
})


module.exports = router;
