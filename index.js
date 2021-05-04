/* eslint-disable prettier/prettier */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const authMiddleware = require('./middleware/auth')
const dotenv = require('dotenv')
dotenv.config()
const morgan = require('morgan')
const bodyParser=require('body-parser')
const app = express()

// Middleware
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors({ credentials: true }))
app.set('trust proxy', 1)
app.use(authMiddleware.initialize)
app.use(morgan('short'))

// Routes
// define further routes
app.use('/book-keeping', require('./routes/book'));
app.use('/deals', require('./routes/dealroutes'));
app.use('/business', require('./routes/busReg'));
app.use('/loans',require('./routes/loan'));
app.use('/check-business-name', require('./routes/checkname'));
app.use('/statistic', require('./routes/statistic'));
app.use('/excite/business', require('./routes/excite/business'));
app.use('/excite/payments', require('./routes/excite/payments'));
app.use('/excite/partners', require('./routes/excite/partners'));
app.use('/excite/banners', require('./routes/excite/banners'));
app.use('/kiosk',require('./routes/kioskroutes'))

app.use([
  require("./routes/auth"),
  require("./routes/products"),
  require("./routes/profile"),
  require("./routes/payments"),
  require("./routes/validation"),
  require("./routes/test"),
  require("./routes/upload"),
  require("./routes/market"),
  require('./routes/adbanner'),
  require('./routes/tax'),
  require('./routes/confirmation')

])

// Error handling
app.use((error, req, res, next) => {
  res.json({
    error: {
      message: error.message
    }
  })
})
const PORT = process.env.PORT || 7000

// Read port and host from the configuration file
app.listen(PORT, () => console.log('Express listening on port ', PORT))
