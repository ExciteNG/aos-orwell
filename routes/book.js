const router = require('express').Router();
const Records = require('../models/bookkeeping');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

// get all book keeping records
router.get('/all',async (req, res) => {

    try {
        const records =  await Records.find()
        .sort({createdAt: 'asc' })
    .lean()
    if (records.length === 0){
        return res.status(404).json({message:"no records yet"})
    }
   return res.status(200).json({"records":records})
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
        const storeId = await Records.findById({_id:id})
        if (!storeId){
            return res.status(404).send({message:"not found"})
        }
        return res.status(200).json({record:storeId})
        
    } catch (err) {
        console.error(err)
        res.status(500).json({error:err.message})
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
        res.status(404).json({message:"not found"})
   }
    else {

        let {productName,price,buyersContact,description} = req.body
        record = await Records.findByIdAndUpdate({_id:id}, req.body,{
            new: true
            // runValidators: true
        })
     }
    return res.status(200).json({update:record})

    }
    catch (err) {
        console.error(err)
       return res.status(500).send({error:err.message})
    }
})

//delete a story from the database
router.delete('/:id', async (req,res) => {

    const id = req.params.id
    
    try {
        let record = await Records.findById({_id:id}).lean()
  
        if (!record) {
          return res.status(404).send({message:"not found"})
        } else {
        await Records.remove({_id:id})
       return  res.status(200).send({message:"Delete successful !"})
          }
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({error:err.message}) 
    }
})

// delete all records
router.delete('/record', async (req,res) => {

    const id = req.params.id
    
    try {
        let record = await Records.find().lean()
        if (record.length===0) {
          return res.status(404).send({message:"records not found"})
        } else {
        await Records.deleteMany()
       return  res.status(200).send({message:"Wipedown complete and successful !"})
    }
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({error:err}) 
    }
})


// add a new record
router.post('/' , async (req,res) =>{
    const id = req.params.id
    try {
        // req.body.user = req.user.id
        await Records.create(req.body)
        return res.status(201).send({message:"success"})
    } catch (err) {
        console.error(err)
        res.status(500).send({message:err.message})
    }
})

module.exports = router
