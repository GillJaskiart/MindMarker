const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");

const authController = require("../controller/auth_controller");


const router = express.Router();

router.get("/login", forwardAuthenticated, authController.login);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
});


// We will fix this soon.
router.get("/register", authController.register);
// app.get("/login", authController.login);
router.post("/register", authController.registerSubmit);
// app.post("/login", authController.loginSubmit);

router.get("/forgot", authController.forgotPassword);
router.post("/forgot", authController.forgotPasswordSubmit);

router.get("/reset-password", authController.resetPassword);
router.post("/reset-password", authController.resetPasswordSubmit);



module.exports = router;
