const router = require('express').Router();
const Records = require('../models/bookkeeping');
const Profiles = require('../models/Profiles');
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

// Sales Plan update products
router.put('/update/:id', (req, res) => {
  let record = new Records({
    _id: req.params.id,
    productName: req.body.productName,
    price: req.body.price,
    // quantity: req.body.quantity,
    buyersContact: req.body.buyersContact,
    description: req.body.description,
    // cost: req.body.cost,
    salesTarget: req.body.salesTarget,
    qtySold: req.body.qtySold,
    // qtySold: req.body.qtySold + req.body.quantity,
    totalPaid: req.body.totalPaid,
    sumTotalPaid: req.body.sumTotalPaid,
  });

  Records.updateOne({ _id: req.params.id }, record).lean()
    .then(() => {
      res.status(202).json({
        message: 'record updated successfully!'
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Oops! Something went wrong.',
        error
      });
    });
});

// update a record by id (general use)
router.put('/:id', async (req,res) =>{
    // let hex = /[0-9A-Fa-f]{6}/g;
    // const id = (hex.test(req.params.id))? ObjectId(req.params.id) : req.params.id;
    const id = req.params.id
    try {
      let record = await Records.findOne({_id:id});
      console.log('record is ', record)
      if (!record){
          res.json({status:404,message:"not found"})
      }
      else {
        let {productName, price, quantity, buyersContact, description, salesTarget, qtySold, totalPaid, sumTotalPaid} = req.body;

        qtySold = record.qtySold + quantity;
        totalPaid = qtySold * price;
        sumTotalPaid = sumTotalPaid + totalPaid;

        // record.markModified("qtySold");

        Records.updateOne({ _id: req.params.id }, record);
        record.save();

        record = await Records.findByIdAndUpdate({_id:id}, req.body,{
            new: true
            // runValidators: true
        })
      }
    return res.json({status:200, update:record})
    }
    catch (err) {
        console.error(err)
       return res.send({status:500, error: err.message})
    }
})



// // update a record by product name
// router.put('/name/:id', async (req,res) =>{
//     // let hex = /[0-9A-Fa-f]{6}/g;
//     // const id = (hex.test(req.params.id))? ObjectId(req.params.id) : req.params.id;
//     const productName = req.params.id
//     try {
//         let record = await Records.find({productName:productName}).lean()
//     if (!record){
//         res.json({status:404,message:"not found"})
//    }
//     else {
//         let {productName, price, quantity, buyersContact, description, qtySum, salesTarget} = req.body
//         record = await Records.findByIdAndUpdate({_id:id}, req.body,{
//             new: true
//             // runValidators: true
//         })
//      }
//     return res.json({status:200,update:record})
//     }
//     catch (err) {
//         console.error(err)
//        return res.send({status:500,error:err.message})
//     }
// })


//delete a record from the database
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
        await Records.create({
          ...req.body,
          storeInfo:storeInfo,
          email
        })
        return res.status(201).send({message:"success"})
    } catch (err) {
        console.error(err)
        res.send({status:500,message:err.message})
    }
})

module.exports = router
