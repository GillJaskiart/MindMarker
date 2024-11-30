const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

const reminderController = require("../controller/reminder_controller");


// router.get("/", (req, res) => {
//   res.send("welcome");
// });

// router.get("/dashboard", ensureAuthenticated, (req, res) => {
//   res.render("dashboard", {
//     user: req.user,
//   });
// });

// case 1: show a list of reminders
router.get("/reminders", reminderController.list);

// case 2: user creates a new reminder
router.get("/reminder/new", reminderController.new);

router.get("/reminder/:id", reminderController.listOne);

// case 6: Edit an individual reminder
router.get("/reminder/:id/edit", reminderController.edit);

// When the user clicks 'submit' on the create reminder page, the reminder is added to the list of reminders
router.post("/reminder/", reminderController.create);

// Implement this yourself
// user clicks the update button from case 6 and expects their reminder to be updated.
router.post("/reminder/update/:id", reminderController.update);

// Implement this yourself
// user clicks the delete button and we expect the reminder to be deleted
router.post("/reminder/delete/:id", reminderController.delete);

module.exports = router;
