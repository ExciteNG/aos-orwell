const Influencer = require('../../models/influencer');
const declineInfluencer = require('../../emails/influencer_decline');
const acceptInfluencer = require('../../emails/influencer_accept');

const approveInfluencer =  async (req,res) => {
    const id = req.params.id
    const oneInfluencer =   Influencer.findById(id).lean()
    const regStatus = oneInfluencer.regStatus;
    regStatus.isApproved = req.body.isApproved;
    regStatus.dateApproved = new Date().toDateString();
    oneInfluencer.regStatus = regStatus;
    oneInfluencer.markModified("regStatus");
    await oneInfluencer.save();

    if (req.body.isApproved === "rejected") {
        //send mail
        nodeoutlook.sendEmail({
          auth: {
            user: process.env.EXCITE_ENQUIRY_USER,
            pass: process.env.EXCITE_ENQUIRY_USER,
          },
          from: "enquiry@exciteafrica.com",
          to: oneInfluencer.email,
          subject: "Notification",
          html: declineInfluencer(),
          text: declineInfluencer(),
          replyTo: "enquiry@exciteafrica.com",
          onError: (e) => console.log(e),
          onSuccess: (i) => console.log(i),
          secure: false,
        });
      } else {
        //send mail
        nodeoutlook.sendEmail({
          auth: {
            user: process.env.EXCITE_ENQUIRY_USER,
            pass: process.env.EXCITE_ENQUIRY_USER,
          },
          from: "enquiry@exciteafrica.com",
          to: oneInfluencer.email,
          subject: "Notification",
          html: acceptInfluencer(),
          text: acceptInfluencer(),
          replyTo: "enquiry@exciteafrica.com",
          onError: (e) => console.log(e),
          onSuccess: (i) => console.log(i),
          secure: false,
        });
      }
}


module.exports = approveInfluencer;