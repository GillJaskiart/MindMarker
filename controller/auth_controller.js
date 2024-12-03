// let database = require("../models/userModel");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


let authController = {
  login: (req, res) => { 
    const message = req.session.message || null;
    const messageType = req.session.messageType || null;
  
    // Clear the message from the session
    req.session.message = null;
    req.session.messageType = null;

    res.render("auth/login", { message, messageType });
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

  registerSubmit: async (req, res) => {
    // implement
    console.log("Register submit handler called");
    const { email, password, name } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      // Email is already registered
      req.session.message = "This email is already registered. Please log in.";
      req.session.messageType = "warning";
      return res.redirect("/auth/login")
      // return res.send(
      //   'This email is already registered. Please use the login button to log in.'
      // );
    }

    // Add new user to the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password, 
        name,
      },
    });

    // Redirect or show a success message
    req.session.message = "Registration successful! You can now log in.";
    req.session.messageType = "success";
    res.redirect("/auth/login");
    // res.send('Registration successful! You can now log in.');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while creating your account.');
  }
},
dashboard: (req, res) => {
  // console.log("User object in dashboard:", req.user); // Debugging
  if (req.user.role === "admin") {
    return res.redirect("/admin");
  }

  res.render("auth/dashboard", { user: req.user });
},

forgotPassword: (req, res) => {
  const message = req.session.message || null;
  const messageType = req.session.messageType || null;

  // Clear the message from the session
  req.session.message = null;
  req.session.messageType = null;

  res.render("auth/forgot", { message, messageType });
},

forgotPasswordSubmit: async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      req.session.message = "No account found with this email address.";
      req.session.messageType = "warning";
      return res.redirect("/auth/forgot");
    }

    req.session.resetEmail = email; 
    return res.redirect("/auth/reset-password");
  } catch (error) {
    console.error(error);
    req.session.message = "An error occurred. Please try again.";
    req.session.messageType = "danger";
    res.redirect("/auth/forgot");
  }
},

resetPassword: (req, res) => {
  const message = req.session.message || null;
  const messageType = req.session.messageType || null

  const email = req.session.resetEmail;

  if (!email) {
    req.session.message = "Invalid session. Please try again.";
    req.session.messageType = "warning";
    return res.redirect("/auth/forgot");
  }
  
  req.session.message = null;
  req.session.messageType = null;

  res.render("auth/reset-password", { message, messageType, email });
},

resetPasswordSubmit: async (req, res) => {
  const { email, password } = req.body;

  try {
    await prisma.user.update({
      where: { email: email },
      data: { password }, 
    });

    req.session.message = "Password updated successfully! You can now log in.";
    req.session.messageType = "success";
    res.redirect("/auth/login");
  } catch (error) {
    console.error(error);
    req.session.message = "An error occurred while updating your password.";
    req.session.messageType = "danger";
    res.redirect("/auth/reset-password");
  }
},
}


module.exports = authController;
