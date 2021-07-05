const KioskModel = require('../models/kiosk');
const nodeoutlook = require('nodejs-nodemailer-outlook');
const kioskAcknowledge=require('../emails/kiosk_acknowledge');

const createKiosk = async (req, res) => {
  const {email, userType}= req.user;
// console.log(req.body)
  const data={...req.body, email}

  const Kiosk = new KioskModel({...data });
  Kiosk.save()
    .then((record) => {
      res.status(201).json({
        message: 'Application submitted successfully'
      });
      //Send Email Here
      nodeoutlook.sendEmail({
        auth: {
          user: process.env.EXCITE_ENQUIRY_USER,
          pass: process.env.EXCITE_ENQUIRY_PASS,
        },
          from: 'enquiry@exciteafrica.com',
          to: data.email,
          subject: 'KIOSK ACKNOWLEDGEMENT EMAIL',
          html: kioskAcknowledge(),
          text: kioskAcknowledge(),
          replyTo: 'enquiry@exciteafrica.com',
          onError: (e) => console.log(e),
          onSuccess: (i) => {
          // return res.json({code:200,message: 'Reset mail has been sent',userType:user.userType});
          console.log(i)
          },
          secure:false,
      })
    })
    .catch((err) => {console.log(err)
      res.status(400).json({
        message: 'Oops! Something went wrong.',
        err
      });
    });
};


module.exports = {
  createKiosk
}
