const KioskModel = require('../models/kiosk');

const createKiosk =async (req, res) => {
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
