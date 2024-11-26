let database = require("../database");

let authController = {
  login: (req, res) => { 
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register");
  },

  loginSubmit: (req, res) => {
    // implement
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/auth/login",
    })
  },

  registerSubmit: (req, res) => {
    // implement
  },
};

module.exports = authController;
