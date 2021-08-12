// middleware for uploading mobile products
const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
// var multerS3 = require("multer-s3-v3");
const { v4: uuidv4 } = require("uuid");


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

  const imageUpload =async (req,res,next)=>{
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
        console.log(error)
       return res.status(500).send(error);
      }
      req.images = data;
      next()
    
    });
    console.log(req.file)
    // next()
  }

  module.exports={
      imageUpload
  }

  


