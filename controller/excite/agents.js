const Agents = require("../../models/Agents");
const Feedbacks = require("../../models/AgentsFeedback")
const Randomstring = require("randomstring");

const generateRefNo = Randomstring.generate({
  length: 6,
  charset: "alphanumeric",
  readable: true,
});

const getAllAgents = async (req, res) => {
  try {
    const allAgents = await Agents.find().populate(['merchants','earnings','payouts']);
    const allFeedbacks = await Feedbacks.find().populate(['reporter']).sort({
      date: -1,
      _id:-1
    });
    res.json({ code: 200, agents: allAgents, feedbacks:allFeedbacks });
  } catch (e) {
    console.log(e)
    res.status(400).json({
      error: e,
      message: "Oops! Something went wrong!",
    });
  }
};

const updateAgent = async (req, res, next) => {
  const { userType } = req.user;
  const { state } = req.body;
  try {
    const profile = await Agents.findOne({ _id: req.params.id });

    if (state) {
      profile.approve = state;
      profile.agentCode = `SG-${generateRefNo}`;
      profile.markModified('agentCode')
      await profile.save();
    } else {
      profile.approve = state;
      profile.agentCode = "";
      profile.markModified('agentCode')
      await profile.save();
    }
    next();
  } catch (error) {
    res.status(500);
  }
};

const updateAgentSector = async (req, res, next) => {
  const { userType } = req.user;
  const { sector } = req.body;
  try {
    const profile = await Agents.findOne({ _id: req.params.id });

    if (sector) {
      profile.sector = sector;
      profile.markModified('sector')
      await profile.save();
    }
    next();
  } catch (error) {
    res.status(500);
  }
};



module.exports = {
  getAllAgents,
  updateAgent,
  updateAgentSector
};
