const FeedBack = require('../models/feedback');

const feedbackEnq = async (req,res) => {
    try {
        let feedback = FeedBack.create(req.body);
        feedback.mode = "Enquiries"
        await feedback.markModified("mode");
        feedback.save();
        return res.json({code:200,success:"Feedback sent successfully !, we will get back to you as soon as possible"})
    } catch (err) {
       return res.json({code:400,message:err.message});
    }
}

const feedbackNews = async (req,res) => {
    try {
        let feedbacknews = Feedback.create(req.body)
        feedbacknews.mode = "Newsletter"
        await feedbacknews.markModified("mode")
        feedbacknews.save()
        return res.json({code:200,success:"sent successfully !, expect a notification in your mail"})
    } catch (err) {
        return res.json({code:400,message:err.message});
    }
}


module.exports = {
    feedbackEnq, feedbackNews
}