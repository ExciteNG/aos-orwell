/* eslint-disable prettier/prettier */
const router = require('express').Router();
const checkName = require('../models/Checkname');
const {requireJWT} = require('../middleware/auth')

router.get('/all-names',async (req, res) => {

    try {
        const check =  await checkName.find()
        .sort({createdAt: 'asc' })
    .lean()
    if (check.length === 0){
        return res.json({status:404,message:"you have no business proposed names yet"})
    }
   return res.status(200).json({"reservations":check})
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
        const checkId = await checkName.findById({_id:id})
        if (!checkId){
            return res.send({status:404,message:"not found"})
        }
        return res.json({status:200,checks:checkId})

    } catch (err) {
        console.error(err)
        res.json({status:500,error:err.message})
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
        res.json({status:404,message:"not found"})
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
       return res.send({status:500,error:err.message})
    }
})

//delete a story from the database
router.delete('/remove/:id', async (req,res) => {

    const id = req.params.id

    try {
        let check = await checkName.findById({_id:id}).lean()

        if (!check) {
          return res.send({status:404,message:"not found"})
        } else {
        await checkName.remove({_id:id})
       return  res.status(200).send({message:"Delete successful !"})
          }
    } catch (err) {
        console.error(err)
        return res.send({status:500,error:err.message})
    }
})

// delete all records
router.delete('/delete/all-names', async (req,res) => {
    try {
        let check = await checkName.find().lean()
        if (check.length===0) {
          return res.send({status:404,message:"no names found"})
        } else {
        await checkName.deleteMany()
       return  res.status(200).send({message:"Wipedown complete and successful !"})
    }
    } catch (err) {
        console.error(err)
        return res.send({status:500,error:err})
    }
})

// add a new record
router.post('/new/name' , requireJWT, async (req,res) =>{
  // console.log(req.body)
  const {email} = req.user
    try {
        await checkName.create({...req.body,email})
        return res.send({status:201,message:"success"})
    } catch (err) {
        console.error(err)
        res.send({status:500,message:err.message})
    }
})

module.exports = router
