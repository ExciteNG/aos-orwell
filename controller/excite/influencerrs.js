const Influencer = require('../../models/influencer');
const declineInfluencer = require('../../emails/influencer_decline');
const acceptInfluencer = require('../../emails/influencer_accept');

const approveInfluencer =  async (req,res) => {

  try {
    const id = req.params.id
    let oneInfluencer =   Influencer.findById(id).lean()
    let regStatus = oneInfluencer.regStatus;
    regStatus = req.body.regStatus;
    oneInfluencer.dateApproved = new Date().toDateString();
    oneInfluencer.regStatus = regStatus;
    oneInfluencer.markModified("regStatus");
    oneInfluencer.markModified("dateApproved");
    await oneInfluencer.save();

    if (req.body.regStatus === "rejected") {
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
      return res.json({code:200,message:"influencer successfully approved"})
  } catch (err) {
    console.error(err)
    return res.json({code:500,message:err.message})
  }
}


module.exports = approveInfluencer;