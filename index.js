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
    const authMiddleware2 = require('./middleware/cookieAuth');
    const dotenv = require('dotenv');
    dotenv.config()
    const morgan = require('morgan');
    const cronJob = require('node-cron');
    const nodeoutlook = require('nodejs-nodemailer-outlook');
    const Influencers = require('./models/influencer');
    const Profiles = require("./models/Profiles");
    const Payments = require('./models/agreeprice');
    const Negotiation = require('./models/infMerchantNegotiate');
    const merchantContractExpired = require('./emails/merchant_contract_expired');
    const influencerContractExpired = require('./emails/influencer_contract_expired');
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
          callback(new Error({code:401,message:'Not allowed by CORS'}))
        }
      }
    }


    // Middleware
    // disable x-powered-by header
    app.disable('x-powered-by');
    app.use(cors({ credentials: true },corsOptions));
    //middleware against standard http header attacks
    app.use(helmet());
    app.use(helmet.frameguard({action:"sameorigin"}));
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

  //run a cronjob to check if the payment agreement for influencer marketing is expired
  // const checkStatus = async () => {
  //   let payments = await Payments.find({negotiationStatus:"accepted"})
  //   payments.forEach(async payment => {
  //     if (Date.now() > payment.endDate){
  //       payment.negotiationStatus = "completed"
  //       let influencer = await Influencers.findOne({fullName:payment.influencerName})
  //       let profile = await Profiles.findOne({email:payment.email})
  //       profile.completedCampaigns = profile.completedCampaigns + 1
  //       await Negotiation.findOneAndUpdate({merchantEmail:profile.email,influencerEmail:influencer.email},{status:"Completed"},{
  //         new:true,runValidators:true}, function (err,docs) {
  //        if (err){
  //             console.error(err)
  //         }
  //         console.log(docs)
  //     })
  //       //send mails to the the respective influencers and merchants
  //       //merchant first
  //          nodeoutlook.sendEmail({
  //           auth: {
  //             user: process.env.EXCITE_ENQUIRY_USER,
  //             pass: process.env.EXCITE_ENQUIRY_PASS,
  //           },
  //             from: 'enquiry@exciteafrica.com',
  //             to: profile.email,
  //             subject: 'NOTIFICATION OF CONTRACT COMPLETION',
  //             html: merchantContractExpired(profile.fullName,influencer.fullName,payment.amountToPay,payment.duration),
  //             text: merchantContractExpired(profile.fullName,influencer.fullName,payment.amountToPay,payment.duration),
  //             replyTo: 'enquiry@exciteafrica.com',
  //             onError: (e) => console.log(e),
  //             onSuccess: (i) => {
  //             // return res.json({code:200,message: 'Reset mail has been sent',userType:user.userType});
  //             console.log(i)
  //             },
  //             secure:false,
  //         })
  //         //send influencer 
  //         nodeoutlook.sendEmail({
  //           auth: {
  //             user: process.env.EXCITE_ENQUIRY_USER,
  //             pass: process.env.EXCITE_ENQUIRY_PASS,
  //           },
  //             from: 'enquiry@exciteafrica.com',
  //             to: influencer.email,
  //             subject: 'NOTIFICATION OF CONTRACT COMPLETION',
  //             html: influencerContractExpired(influencer.fullName,profile.fullName,payment.amountToPay,payment.duration),
  //             text: influencerContractExpired(influencer.fullName,profile.fullName,payment.amountToPay,payment.duration),
  //             replyTo: 'enquiry@exciteafrica.com',
  //             onError: (e) => console.log(e),
  //             onSuccess: (i) => {
  //             // return res.json({code:200,message: 'Reset mail has been sent',userType:user.userType});
  //             console.log(i)
  //             },
  //             secure:false,
  //         })

  //     }
      
  //   });

  // }


  cronJob.schedule('0 0 * * *',()=>checkSub())
  // cronJob.schedule('0 0 * * *', () => checkStatus())


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
    app.use('/excite/tax', require('./routes/excite/tax'));
    app.use('/excite/payments', require('./routes/excite/payments'));
    app.use('/excite/partners', require('./routes/excite/partners'));
    app.use('/excite/banners', require('./routes/excite/banners'));
    app.use('/excite/influencers',require('./routes/excite/influencers'));
    app.use('/excite/agent',require('./routes/excite/agents'));
    app.use('/partners',require('./routes/partners/partners'));
    app.use('/password-forgot',require('./routes/passportreset'));
    app.use('/reset-password',require('./routes/normalpasswordreset'));
    app.use('/change-password',require('./routes/changepassword'));
    app.use('/payments',require('./routes/payment'));
    app.use('/support',require('./routes/feedbackroutes'));
    app.use('/marketplace',require('./routes/market'));
    app.use('/customer',require('./routes/customer'));
    app.use('/balance',require('./routes/balance'));
    app.use('/transaction',require('./routes/transactions/transaction'));
    app.use('/post-transaction',require('./routes/transactions/posttransaction'));
    app.use('/paystack',require('./helper/payments/generate'));
    app.use('/influencer-marketing',require('./routes/influenceroutes'))
    app.use('/sales-agent',require('./routes/agents'))

    app.use([
      require("./routes/angolia"),
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
      require('./routes/social'),
      require('./helper/migrations/migrate'),
      require('./routes/')
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
