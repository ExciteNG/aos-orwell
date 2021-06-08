const express = require('express')
const { verifyCookie } = require('../middleware/cookieAuth')
const router = express.Router();
const Profiles = require('./../models/Profiles')

router.get('/merchants',verifyCookie,async (req, res) => {
  if(req.user!=="EX10AF") return res.status(401);
  // const profile = await Profiles.findOne({email:req.profile}).populated('product')
  const profile = await Profiles.findOne({ email: req.profile }).populate('product')

  if(!profile) return res.status(401);
  return res.json({user:true,profile:profile})
  })
router.get('/affiliates',verifyCookie,(req, res) => {
  if(req.user!=="EX20AF") return res.status(401)
  return res.json({user:true})
  })
router.get('/consultants',verifyCookie,(req, res) => {
  if(req.user!=="EX10AF") return res.status(401)
  return res.json({user:true})
  })
router.get('/spring-board',verifyCookie,(req, res) => {
  if(req.user!=="EXSBAF") return res.status(401)
  return res.json({user:true})
  })
module.exports = router
