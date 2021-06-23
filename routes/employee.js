const express = require('express')

const { requireJWT } = require('../middleware/auth')

const router = express.Router();


//Client Get all Employees
router.get('/app/v2/004/allemployees', requireJWT, (req,res) =>{

})


module.exports = router
