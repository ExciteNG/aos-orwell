const express = require('express')
const multer = require('multer')
const AWS = require('aws-sdk')

const { v4: uuidv4 } = require('uuid'); 


const router = express.Router()




const s3 = new AWS.S3({
    credentials: {  
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region:process.env.AWS_S3_REGION_NAME,
    
    }
})

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({storage}).single('image')

router.post('/upload',upload,(req, res) => {

    let myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]

    const params = {
        Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
      Key: `${"Enterprise-Images/ProductImages"}/${uuidv4()}.${fileType}`,
        Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
        if(error){
            res.status(500).send(error)
        }

        res.status(200).send(data)
    })
})

module.exports = router
