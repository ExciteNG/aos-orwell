/* eslint-disable prettier/prettier */
const router = require('express').Router();
const busRegister = require('../models/businessreg')
//express-rate-limit middleware
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());
const createLimiter = rateLimit({
    windowMs: 14*24*60 * 60 * 1000, // two weeks window
    max: 1, // start blocking after making a  request
    message:
     {error: "please try again after a fortnight (fourteen days)"}
  });


//get all businesses registered by a user
router.get('/all', async (req,res) => {
    try {
        const register =  await busRegister.find()
        .sort({createdAt: -1 })
    .lean()
    if (register.length === 0){
        return res.status(404).json({message:"no businesses registered yet"})
    }
   return res.status(200).json({"records":register})
    }
    catch (err){
        console.error(err)
       return res.status(500).json({"error":err.message})
    }
})

router.post('/new/sole-propietor', async (req,res)=>{
    try {
        // req.body.user = req.user.id
        await busRegister.create({...req.body,businessRegType:"Sole Propietorship"})
        return res.status(201).send({message:"success"})
    } catch (err) {
        console.error(err)
        res.status(500).send({message:err.message})
    }
})

//delete all  business
router.delete('/item/all', async (req,res)=>{

    try {
        let business = await busRegister.find().lean()
        if (business.length===0) {
          return res.status(404).send({message:"no businesses found"})
        } else {
        await busRegister.deleteMany()
       return  res.status(200).send({message:"Wipedown of all businesses complete and successful !"})
     }
    } catch (err) {
        console.error(err)
        return res.status(500).send({error:err.message})
    }
})

//get a specific user business
router.get('/:id',async (req,res)=>{
        const id = req.params.id
        try {
            const busId = await busRegister.findById({_id:id})
            if (!busId){
                return res.status(404).send({message:"not found"})
            }
            return res.status(200).json({record:busId})

        } catch (err) {
            console.error(err)
            res.status(500).json({error:err.message})
        }
});

//edit a specific  business detail
router.put("/edit/:id",createLimiter, async (req,res)=>{
    const id = req.params.id

    try {
        let business = await busRegister.findById({_id:id}).lean()

    if (!business){
        res.status(404).json({message:"not found"})
   }
    else {
        business = await busRegister.findByIdAndUpdate({_id:id}, req.body,{
            new: true
            // runValidators: true
        })
     }
    return res.status(200).json({update:business})

    }
    catch (err) {
        console.error(err)
       return res.status(500).send({error:err.message})
    }

})


router.delete('/item/:id', async (req,res)=>{
    const id = req.params.id

    try {
        let business = await busRegister.findById({_id:id}).lean()

        if (!business) {
          return res.status(404).send({message:"not found"})
        } else {
        await busRegister.remove({_id:id})
       return  res.status(200).send({message:"Delete successful !"})
          }

    } catch (err) {
        console.error(err)
        return res.status(500).send({error:err.message})
    }
})

module.exports = router
