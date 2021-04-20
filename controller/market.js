const Products = require('./../models/Products');


const getAllElectronics = async (req,res)=>{

    const electronics = await Products.find({category:'electronics'});

    res.json({code:201,electronics})
}

const getOneElectronic = async (req,res)=>{
    const id = req.params.id
    console.log(id)
    // 
    const item = await Products.findOne({_id:id})
    res.json({code:201,item})
}



module.exports={
    getAllElectronics,
    getOneElectronic
}