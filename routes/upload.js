/* eslint-disable prettier/prettier */
const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
// var multerS3 = require("multer-s3-v3");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION_NAME,
  },
});

const storage = multer.memoryStorage({
  destination: function(req, file, callback) {
    callback(null, "");
  },
});

const upload = multer({ storage }).single("image");

// DELETE FROM S3
const s3delete = function(key) {
  const item = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME /* required */,
    Key: key /* required */,
  };
  return new Promise((resolve, reject) => {
    s3.createBucket(
      {
        Bucket: process.env.AWS_STORAGE_BUCKET_NAME /* Put your bucket name */,
      },
      function() {
        s3.deleteObject(item, function(err, data) {
          if (err) return reject(err);
          else {
            // console.log(`${data} data`);
          }
          // console.log(data);
          resolve(data)
        });
      }
    );
  });
};

router.post("/upload", upload, (req, res) => {
  // console.log(req)
  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];
  const params = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    Key: `${"Enterprise-Images/ProductImages"}/${uuidv4()}.${fileType}`,
    Body: req.file.buffer,
    ACL: "public-read",
  };
  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    res.status(200).send(data);
  });
});
//

router.post('/upload/delete-item', async function(req, res, next) {
  const {key} = req.body; 
    // console.log(key)
    const response = await s3delete(key)
  res.json({code:201,response})
})



// Product Listing
router.post('/upload/products',upload, async (req,res)=>{
 // console.log(req)
 let myFile = req.file.originalname.split(".");
 const fileType = myFile[myFile.length - 1];
 const params = {
   Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
   Key: `${"Enterprise-Images/marketplace/ProductListing"}/${uuidv4()}.${fileType}`,
   Body: req.file.buffer,
   ACL: "public-read",
 };
 s3.upload(params, (error, data) => {
   if (error) {
     res.status(500).send(error);
   }
   res.status(200).json({code:201,data});
 });
})

// Affiliate Marketers Uploads
router.post('/upload/affiliates',upload, async (req,res)=>{
 // console.log(req)
 let myFile = req.file.originalname.split(".");
 const fileType = myFile[myFile.length - 1];
 const params = {
   Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
   Key: `${"Enterprise-Images/AffiliateMarketers"}/${uuidv4()}.${fileType}`,
   Body: req.file.buffer,
   ACL: "public-read",
 };
 s3.upload(params, (error, data) => {
   if (error) {
     res.status(500).send(error);
   }
   res.status(200).json({code:201,data});
 });
})
// Partners Uploads
router.post('/upload/partners',upload, async (req,res)=>{
 // console.log(req)
 let myFile = req.file.originalname.split(".");
 const fileType = myFile[myFile.length - 1];
 const params = {
   Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
   Key: `${"Enterprise-Images/Partners"}/${uuidv4()}.${fileType}`,
   Body: req.file.buffer,
   ACL: "public-read",
 };
 s3.upload(params, (error, data) => {
   if (error) {
     res.status(500).send(error);
   }
   res.status(200).json({code:201,data});
 });
})

// upload banner
router.post('/upload/banner',upload, async (req,res)=>{
 // console.log(req)
 let myFile = req.file.originalname.split(".");
 const fileType = myFile[myFile.length - 1];
 const params = {
   Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
   Key: `${"Enterprise-Images/Banners"}/${uuidv4()}.${fileType}`,
   Body: req.file.buffer,
   ACL: "public-read",
 };
 s3.upload(params, (error, data) => {
   if (error) {
     res.status(500).send(error);
   }
   res.status(200).json({code:201,data});
 });
})

module.exports = router;
