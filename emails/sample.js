/* eslint-disable prettier/prettier */
var nodeoutlook = require('nodejs-nodemailer-outlook')
let mail = require('./new_welcome_templates')
// let emailTemplate = require('../emails/templates')
//let mail = require('./templates')
nodeoutlook.sendEmail({
    auth: {
        user: "enquiry@exciteafrica.com",
        pass: "ExciteManagement123$"
    },
    from: 'enquiry@exciteafrica.com',
    to: 'tosin.adedotun@precise.com.ng',
    subject: 'Hey you, awesome!',
    html: mail('Tosin'),
    text: 'This is text version!',
    replyTo: 'enquiry@exciteafrica.com',
    onError: (e) => console.log(e),
    onSuccess: (i) => console.log(i),
    secure:false
});