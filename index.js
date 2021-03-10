if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const authMiddleware = require('./middleware/auth')

const config = require('./config')

const server = express()

// Middleware
server.use(bodyParser.json())
server.use(cors({ credentials: true }))
server.use(authMiddleware.initialize)

// Routes
server.use([require('./routes/auth'), require('./routes/rooms'), require('./routes/validation'),require('./routes/test')])

// Error handling
server.use((error, req, res, next) => {
  res.json({
    error: {
      message: error.message
    }
  })
})
const PORT = process.env.PORT || 7000

// Read port and host from the configuration file
server.listen(PORT, ()=>console.info('Express listening on port ', PORT))
