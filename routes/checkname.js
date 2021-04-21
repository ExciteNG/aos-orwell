/* eslint-disable prettier/prettier */
const router = require('express').Router();
const checkName = require('../models/Checkname');

router.get('/all-names',async (req, res) => {

    try {
        const check =  await checkName.find()
        .sort({createdAt: 'asc' })
    .lean()
    if (check.length === 0){
        return res.status(404).json({message:"you have no business proposed names yet"})
    }
   return res.status(200).json({"businessNames":check})
    }
    catch (err){
        console.error(err)
       return res.status(500).json({"error":err.message})
    }
})
// get a specific record by id
router.get('/:id', async (req,res)=>{

    const id = req.params.id
    try {
        const checkId = await checkName.findById({_id:id})
        if (!checkId){
            return res.status(404).send({message:"not found"})
        }
        return res.status(200).json({checks:checkId})
        
    } catch (err) {
        console.error(err)
        res.status(500).json({error:err.message})
    }
})

// update a new record
router.put('/update/:id', async (req,res) =>{

    // let hex = /[0-9A-Fa-f]{6}/g;
    // const id = (hex.test(req.params.id))? ObjectId(req.params.id) : req.params.id;
    const id = req.params.id
    
    try {
        let checkId = await checkName.findById({_id:id}).lean()

    if (!checkId){
        res.status(404).json({message:"not found"})
   }
    else {

        
        checkId = await checkName.findByIdAndUpdate({_id:id}, req.body,{
            new: true,
             runValidators: true
        })
     }
    return res.status(200).json({update:checkId})

    }
    catch (err) {
        console.error(err)
       return res.status(500).send({error:err.message})
    }
})

//delete a story from the database
router.delete('/remove/:id', async (req,res) => {

    const id = req.params.id
    
    try {
        let check = await checkName.findById({_id:id}).lean()
  
        if (!check) {
          return res.status(404).send({message:"not found"})
        } else {
        await checkName.remove({_id:id})
       return  res.status(200).send({message:"Delete successful !"})
          }
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({error:err.message}) 
    }
})

// delete all records
router.delete('/delete/all-names', async (req,res) => {
    
    try {
        let check = await checkName.find().lean()
        if (check.length===0) {
          return res.status(404).send({message:"no names found"})
        } else {
        await checkName.deleteMany()
       return  res.status(200).send({message:"Wipedown complete and successful !"})
    }
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({error:err}) 
    }
})


// add a new record
router.post('/new/name' , async (req,res) =>{
    try {
        // req.body.user = req.user.id
        await checkName.create(req.body)
        return res.status(201).send({message:"success"})
    } catch (err) {
        console.error(err)
        res.status(500).send({message:err.message})
    }
})

module.exports = router