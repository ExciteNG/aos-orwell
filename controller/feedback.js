const FeedBack = require('../models/feedback');
const nodeoutlook = require('nodejs-nodemailer-outlook');
const autoResponse = require('../emails/auto_response');

const feedbackEnq = async (req,res) => {
    try {
        let feedback = new FeedBack(req.body);
        feedback.mode = "Enquiries"
        // await feedback.markModified("mode");
        feedback.save();
        nodeoutlook.sendEmail({
            auth: {
              user: process.env.EXCITE_ENQUIRY_USER,
              pass: process.env.EXCITE_ENQUIRY_PASS,
            },
              from: 'enquiry@exciteafrica.com',
              to: req.body.email,
              subject: 'RESPONSE FROM EXCITE CUSTOMER CARE',
              html: autoResponse(req.body.name),
              text: autoResponse(req.body.name),
              replyTo: 'enquiry@exciteafrica.com',
              onError: (e) => console.log(e),
              onSuccess: (i) => {
              // return res.json({code:200,message: 'Reset mail has been sent',userType:user.userType});
              console.log(i)
              },
              secure:false,
          })
        return res.json({code:200,success:"Feedback sent successfully !, we will get back to you as soon as possible"})
    } catch (err) {
       return res.json({code:400,message:err.message});
    }
}

const feedbackNews = async (req,res) => {
    console.log(req.body)
    try {
        let feedbacknews = new FeedBack(req.body);
        feedbacknews.mode = "Newsletter"
        // await feedbacknews.markModified("mode")
        // console.log('hi')
        feedbacknews.save()
        return res.json({code:200,success:"sent successfully !, expect a notification in your mail"})
    } catch (err) {
        return res.json({code:400,message:err.message});
    }
}


module.exports = {
    feedbackEnq, feedbackNews
}