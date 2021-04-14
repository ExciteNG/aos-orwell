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
const app = express()

// Middleware
app.use(express.json())
app.use(cors({ credentials: true }))
app.set('trust proxy', 1)
app.use(authMiddleware.initialize)
app.use(morgan('short'))

// Routes
// define further routes
app.use('/book-keeping', require('./routes/book'))
app.use('/deals', require('./routes/dealroutes'))
app.use('/business', require('./routes/busReg'))

app.use([
  require("./routes/auth"),
  require("./routes/products"),
  require("./routes/profile"),
  require("./routes/payments"),
  require("./routes/validation"),
  require("./routes/test"),
  require("./routes/upload"),
  require("./routes/market"),
  require('./routes/adbanner')
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
