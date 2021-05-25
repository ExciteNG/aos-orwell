/* eslint-disable spaced-comment */
/* eslint-disable prettier/prettier */
//scaling the application by increasing the worker processes (increasing concurrency and multithreading)
const clusters = require('cluster')
//get the number of cpus which ideally should be 4
const os = require('os').cpus().length;

if (clusters.isMaster){
  console.log(`process ${process.pid} is currently running`)

  for (var i=0;i<os;i++){
    clusters.fork()
  }

  clusters.on('exit',(worker,code,signal)=>{
    console.error(`worker ${worker.process.pid} died`)
  })
}


else {
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
    const helmet = require('helmet');
    
    const app = express()
    
    //middleware csp for protection against xss attacks 
    
    app.use(function(req, res, next) {
      res.setHeader("Content-Security-Policy", "script-src 'self';");
      next();
    });
    
    //middleware for protection against clickjacking attacks
    
    app.use(function(req, res, next) {
      res.setHeader("Content-Security-Policy", "frame-ancestors 'self';");
      next();
    });
    
    
    // Middleware
    //middleware against standard http header attacks
    app.use(helmet());
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(cors({ credentials: true }));
    app.set('trust proxy', 1);
    app.use(authMiddleware.initialize);
    app.use(morgan('short'));
    
    // Routes
    // define further routes
    app.use('/sales', require('./routes/salesRoute'));
    app.use('/receivables', require('./routes/receivablesRoute'));
    app.use('/book-keeping', require('./routes/book'));
    app.use('/kiosk',require('./routes/kioskroutes'));
    app.use('/deals', require('./routes/dealroutes'));
    app.use('/business', require('./routes/busReg'));
    app.use('/loans',require('./routes/loan'));
    app.use('/check-business-name', require('./routes/checkname'));
    app.use('/statistic', require('./routes/statistic'));
    app.use('/excite/business', require('./routes/excite/business'));
    app.use('/excite/payments', require('./routes/excite/payments'));
    app.use('/excite/partners', require('./routes/excite/partners'));
    app.use('/excite/banners', require('./routes/excite/banners'));
    app.use('/partners',require('./routes/partners/partners'));
    app.use('/password-forgot',require('./routes/passportreset'));
    app.use('/reset-password',require('./routes/normalpasswordreset'));
    app.use('/change-password',require('./routes/changepassword'));
    app.use('/payments',require('./routes/payment'))
    
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
      require('./routes/confirmation'),
      // require('./routes/social')
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

    console.log(`worker ${process.pid} has started`)

}

