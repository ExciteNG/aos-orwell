const express = require('express');
const {requireJWT} = require('./../../middleware/auth')
const router = express.Router();

const controller = require('./../../controller/excite/agents')

router.get('/get-all',requireJWT,controller.getAllAgents);
router.put('/update/:id',requireJWT,controller.updateAgent,controller.getAllAgents);
router.put('/sector/assign/:id',requireJWT,controller.updateAgentSector,controller.getAllAgents);
// router.put('/update/:id',requireJWT,controller.updateAgent,controller.getAllAgents);

// For External Agents
router.get('/get-all/ext04',requireJWT,controller.getAllExtAgents);
router.put('/update/ext/:id',requireJWT,controller.updateExtAgent,controller.getAllExtAgents);


module.exports = router;
