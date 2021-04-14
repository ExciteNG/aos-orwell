const express = require('express')
const moment = require('moment')
const momentTimezone = require('moment-timezone')
const { requireJWT } = require('../middleware/auth')

const router = express.Router()

router.get('/app/v2/004/profile', requireJWT, (req,res)=>{
    res.send('ok')
})



module.exports = router
