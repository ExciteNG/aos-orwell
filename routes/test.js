const express = require('express')
const Product = require("./../models/Products")

const router = express.Router()

router.get('/',(req, res) => {

  res.send("Welcome, server is up and running")

  })

module.exports = router
