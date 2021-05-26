const FeedBack = require('../models/feedback');

const feedbackEnq = async (req,res) => {
    try {
        let feedback = new FeedBack(req.body);
        feedback.mode = "Enquiries"
        // await feedback.markModified("mode");
        feedback.save();
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
        console.log('hi')
        feedbacknews.save()
        return res.json({code:200,success:"sent successfully !, expect a notification in your mail"})
    } catch (err) {
        return res.json({code:400,message:err.message});
    }
}


module.exports = {
    feedbackEnq, feedbackNews
}