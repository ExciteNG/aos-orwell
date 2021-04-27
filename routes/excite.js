const express = require('express');
const router = express.Router();
const CheckName = require('../models/Checkname')
const BusinessReg = require('../models/businessreg')

router.get('/name-reservation', async (req, res) => {
  try {
    const nameReserve = await CheckName.find();
    res.status(200).json({message: nameReserve})
  } catch (e) {
    res.json({message: 'Oops! Something went wrong!'})
  }
});

router.get('/name-registration', async (req, res) => {
  try {
    const nameRegister = await BusinessReg.find();
    res.status(200).json({message: nameRegister})
  } catch (error) {
    res.json({message: error})
  }
});

module.exports = router
