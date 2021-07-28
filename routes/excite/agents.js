const express = require('express');
const {requireJWT} = require('./../../middleware/auth')
const router = express.Router();

const controller = require('./../../controller/excite/agents')

router.get('/get-all',requireJWT,controller.getAllAgents);
router.put('/update/:id',requireJWT,controller.updateAgent,controller.getAllAgents);




module.exports = router;
