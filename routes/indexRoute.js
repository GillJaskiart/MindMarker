const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

const reminderController = require("../controller/reminder_controller");

// router.get("/", (req, res) => {
//   res.send("welcome");
// });

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  // check if the user is admin, if admin then redirect to admin page
  if (req.user.role === "admin") {
    res.redirect("/admin");
  } else {
    res.render("auth/dashboard", {
      user: req.user,
    });
  }
});

router.get("/admin", ensureAuthenticated, (req, res) => {
  req.sessionStore.all((err, sessions) => {
    console.log(sessions);
    res.render("admin", {
      user: req.user,
      sessions: sessions,
    });
  });   
})

// case 1: show a list of reminders
router.get("/reminders", ensureAuthenticated, reminderController.list);

// case 2: user creates a new reminder
router.get("/reminder/new", ensureAuthenticated, reminderController.new);

router.get("/reminder/:id", ensureAuthenticated, reminderController.listOne);

// case 6: Edit an individual reminder
router.get("/reminder/:id/edit", ensureAuthenticated, reminderController.edit);

// When the user clicks 'submit' on the create reminder page, the reminder is added to the list of reminders
router.post("/reminder/", ensureAuthenticated, reminderController.create);

// Implement this yourself
// user clicks the update button from case 6 and expects their reminder to be updated.
router.post("/reminder/update/:id", ensureAuthenticated, reminderController.update);

// Implement this yourself
// user clicks the delete button and we expect the reminder to be deleted
router.post("/reminder/delete/:id", ensureAuthenticated, reminderController.delete);

router.post("/revoke/:session", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    const session = req.params;
    console.log(Object.values(session));

    req.sessionStore.destroy(Object.values(session), (err) => {
      if (err) {
        console.log("Error occured while revoking session", err);
        res.redirect("/admin");
      } else {
        res.redirect("/admin")
      }
    })
    // req.session = null ;
    // res.redirect("/admin");
  } else {
  res.redirect("/auth/login");
  }
});


module.exports = router;
