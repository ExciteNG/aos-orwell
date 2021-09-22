const { response } = require("express");
const Survey = require("./../../models/Survey");

const addNewSurvey = async (req, res) => {
  try {
    const survey = new Survey({ ...req.body });
    survey.Date = Date.now();
    const doc = await survey.save();
    if (doc) {
      return res.status(201).json({code:201,doc});
    }
    return res.status(400);
  } catch (err) {
      console.log(err)
    return res.status(500).json({ code: 400, message: err.message });
  }
};

const getAllSurvey = async (req, res) => {
  try {
    const survey = await Survey.find();
    return res.json(survey);
  } catch (err) {
    return res.json({ code: 400, message: err.message });
  }
};

module.exports = {
  addNewSurvey,
  getAllSurvey,
};
