const express = require("express");
const { requireJWT } = require("../middleware/auth");
const router = express.Router();




// my affiliate profile
router.get("/", requireJWT, async (req, res) => {
  res.send('ok')
});


module.exports = router
