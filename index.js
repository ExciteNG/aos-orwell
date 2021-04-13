if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const authMiddleware = require('./middleware/auth')
const dotenv = require('dotenv')
dotenv.config()
const morgan = require('morgan')
const app = express()

// Middleware
app.use(express.json())
app.use(cors({ credentials: true }))
app.use(authMiddleware.initialize)
app.use(morgan('short'))

// Routes
app.use([
<<<<<<< HEAD
  require('./routes/auth'),
  require('./routes/rooms'),
  require('./routes/validation'),
  require('./routes/messenger'),
  require('./routes/test'),
  require('./routes/clients/admin/employees'),
  require('./routes/clients/admin/task'),
  require('./routes/upload'),
  require('./routes/market')
])
// define further routes
app.use('/book-keeping', require('./routes/book'))
app.use('/deals', require('./routes/dealroutes'))
=======
  require("./routes/auth"),
  require("./routes/products"),
  require("./routes/profile"),
  require("./routes/payments"),
  require("./routes/validation"),
  require("./routes/test"),
  require("./routes/upload"),
  require("./routes/market"),
]);

>>>>>>> 3632f0428cfdce73adfde216a1bdc09ed7ba8ad5
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
