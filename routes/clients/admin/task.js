const express = require("express");
const moment = require("moment");
const momentTimezone = require("moment-timezone");
const { requireJWT } = require("../../../middleware/auth");
const Task = require("../../../models/taskManager");
const Profile = require("../../../models/Profiles");
const router = express.Router();

//assign new task
router.post("/app/v2/004/new-task", requireJWT, (req, res) => {
  const {
    to,
    name,
    email,
    title,
    description,
    commence,
    ends,
    teams,
  } = req.body;
  const newTask = {
    name,
    title,
    description,
    commence,
    ends,
    teams,
    assignedBy: req.user.email,
    supervisedBy: email,
  };
  const taskInstance = new Task(newTask);
  taskInstance.save((error, doc) => {
    if (error) {
      return res.json({ code: 400, error });
    }
    console.log(to);
    // save to supervisor profile
    Profile.findById(to, (error, document) => {
      if (error) {
        return res.json({ code: 400, error });
      }
      let profile = document;
      if (profile) {
        // push task, push notification
        profile.task.push(doc);
        profile.save();
      }
    });

      // save to each team profile
      const teamsArr= teams.split(',')
      for (let team of teamsArr ){
          console.log(team,teamsArr)
        Profile.findOne({ email: team }, (err, docs) => {
          if (err) {
            return res.json({ code: 400, err });
          }
          let profile = docs;
          if (docs) {
            // push task, push notification
            profile.task.push(taskInstance);
            profile.save();
          }
        });
      }
      res.json({ code: 200, message: "message sent" });

    // res.json({code:200,doc})
  });
});

module.exports = router;
