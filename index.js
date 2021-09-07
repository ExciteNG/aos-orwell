/* eslint-disable spaced-comment */
/* eslint-disable prettier/prettier */
//scaling the application by increasing the worker processes (increasing concurrency and multithreading)
const clusters = require('cluster');

//SET THE CPU WORKERS
const WORKERS = process.env.WEB_CONCURRENCY || 4
if (clusters.isMaster){
  console.log(`process ${process.pid} is currently running`)

  for (var i=0; i<WORKERS; i++){
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

    const express = require('express');
    const cors = require('cors');
    const compression = require('compression');
    const authMiddleware = require('./middleware/auth');
    const dotenv = require('dotenv');
    dotenv.config()
    const morgan = require('morgan');
    const cronJob = require('node-cron');
    const Profiles = require("./models/Profiles");
 
    const bodyParser=require('body-parser');
    const cookieParser = require('cookie-parser');
    const helmet = require('helmet');

    const app = express()


    //middleware csp for protection against xss attacks

    app.use(function(req, res, next) {
      res.setHeader("Content-Security-Policy", "script-src 'self';");
      next();
    });

    //whitelist host addresses that can only consume  the backend APIS
    var whitelist = ['https://www.exciteenterprise.com', 'http://localhost:7000','http://localhost:3000']


    // handle cors requests
    var corsOptions = {
      origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          //TO UNCOMMENT
          // callback(new Error({code:401,message:'Not allowed by CORS'})) 
          callback(null, true)

        }
      }
    }


    // Middleware
    // disable x-powered-by header
    app.disable('x-powered-by');
    app.use(cors({ credentials: true },corsOptions));
    //middleware against standard http header attacks
    app.use(helmet());
    app.use(helmet.frameguard({ action: 'SAMEORIGIN' }));
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(compression());
    app.set('trust proxy', 1);
    app.use(authMiddleware.initialize);
    // app.use(authMiddleware2.initialize);
    app.use(morgan('short'));

    //run the cron job
    //create the cron job helper function

  const checkSub = async () => {
      let profiles = await Profiles.find();
      profiles.forEach((profile) => {
        if (Date.now() > profile.subscriptionEnd){
          profile.subscriptionLevel= 0
         profile.save()
      }
    })
    return profiles
  }

  cronJob.schedule('0 0 * * *',()=>checkSub())
  // cronJob.schedule('0 0 * * *', () => checkStatus())


    // Routes
    // define further routes
    app.use('/test', require('./routes/test'));
    app.use('/auth', require('./routes/auth'));
 

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
