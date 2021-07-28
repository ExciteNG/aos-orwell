const Agents = require("../../models/Agents");
const Randomstring = require("randomstring");

const generateRefNo = Randomstring.generate({
  length: 6,
  charset: "alphanumeric",
  readable: true,
});

const getAllAgents = async (req, res) => {
  try {
    const allAgents = await Agents.find().populate('merchants')
    res.json({ code: 200, agents: allAgents });
  } catch (e) {
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

module.exports = {
  getAllAgents,
  updateAgent,
};
