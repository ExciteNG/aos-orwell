const express = require("express");
const { requireJWT } = require("../middleware/auth");
const router = express.Router();

const Controller = require("./../controller/Survey/Survey.controller")



// 
router.post("/new-response", Controller.addNewSurvey);

router.post("/all-response", Controller.getAllSurvey);


module.exports = router
