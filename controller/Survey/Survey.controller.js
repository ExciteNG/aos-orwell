const Survey = require("./../../models/Survey");

const addNewSurvey = async (req, res) => {
  try {
    const survey = new Survey({ ...req.body });
    survey.Date = Date.now();

    await survey.save();
  } catch (err) {
    return res.json({ code: 400, message: err.message });
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
