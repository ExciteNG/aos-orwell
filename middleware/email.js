/* eslint-disable spaced-comment */
/* eslint-disable prettier/prettier */
//module for sending emails on signup
const sgMail = require('@sendgrid/mail');
//import email templates
const emailTemplate = require('./template')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//define a function to send email

const sendMail = (email,name,uri,token) => {
    let msg = {
        to: email, // Change to your recipient
        from: 'iyayiemmanuel1@gmail.com', // Change to your verified sender
        subject: 'Verify Your Account',
        text: emailTemplate(name,uri,token),
        html: emailTemplate(name,uri,token),
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
          return res.json({status:200,message:"Email sent successfully"})
        })
        .catch((err) => {
          console.error(err)
        })

}
module.exports = sendMail