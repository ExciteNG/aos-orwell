const express = require('express')
const multer = require('multer')
const AWS = require('aws-sdk')
const multerS3 = require('multer-s3')
// var multerS3 = require("multer-s3-v3");
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
const uploadMul = multer({storage}).array('photos',5)

const uploadMultiple = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_STORAGE_BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  })


  // Multiple File Uploads ( max 4 )
const uploadsBusinessGallery = multer({
    storage: multerS3({
     s3: s3,
     bucket: process.env.AWS_STORAGE_BUCKET_NAME,
     acl: 'public-read',
     key: function (req, file, cb) {
      cb( null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
     }
    }),
    limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    // fileFilter: function( req, file, cb ){
    //  checkFileType( file, cb );
    // }
   }).array( 'photos', 4 );

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
// 
   
  router.post('/upload/multiple', uploadMultiple.array('photos',5), function(req, res, next) {
      console.log(req)
    res.send('Successfully uploaded ' + req.files.length + ' files!')
  })

  router.post('/new/multiple',(req,res)=>{
      console.log(req)
    uploadsBusinessGallery( req, res, ( error ) => {
        console.log( 'files', req.files );
        if( error ){
         console.log( 'errors', error );
         res.json( { error: error } );
        } else {
         // If File not found
         if( req.files === undefined ){
          console.log( 'Error: No File Selected!' );
          res.json( 'Error: No File Selected' );
         } else {
          // If Success
          let fileArray = req.files
           res.json( {
            filesArray: fileArray
           } );
          }
         }
        });
  })

module.exports = router

 

