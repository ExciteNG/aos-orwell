var nodeoutlook = require('nodejs-nodemailer-outlook')
let emailTemplate = require('../emails/templates')
nodeoutlook.sendEmail({
    auth: {
        user: "enquiry@exciteafrica.com",
        pass: "ExciteManagement123$"
    },
    from: 'enquiry@exciteafrica.com',
    to: 'ojotuk14@gmail.com',
    subject: 'Hey you, awesome!',
    html: '<b>This is bold text</b>',
    text: 'This is text version!',
    replyTo: 'enquiry@exciteafrica.com',
    onError: (e) => console.log(e),
    onSuccess: (i) => console.log(i),
    secure:false
}
 
 
);