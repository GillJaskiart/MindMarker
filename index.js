const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller");


app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const passport = require("./middleware/passport");

app.use(express.json());
app.use(expressLayouts);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log(req.session.passport);
  next();
});

// Routes start here

// case 1: show a list of reminders
app.get("/reminders", reminderController.list);

// case 2: user creates a new reminder
app.get("/reminder/new", reminderController.new);

app.get("/reminder/:id", reminderController.listOne);

// case 6: Edit an individual reminder
app.get("/reminder/:id/edit", reminderController.edit);

// When the user clicks 'submit' on the create reminder page, the reminder is added to the list of reminders
app.post("/reminder/", reminderController.create);

// Implement this yourself
// user clicks the update button from case 6 and expects their reminder to be updated.
app.post("/reminder/update/:id", reminderController.update);

// Implement this yourself
// user clicks the delete button and we expect the reminder to be deleted
app.post("/reminder/delete/:id", reminderController.delete);

// We will fix this soon.
app.get("/register", authController.register);
app.get("/login", authController.login);
app.post("/register", authController.registerSubmit);
app.post("/login", authController.loginSubmit);

app.listen(3001, function () {
  console.log(
    "Server running. Visit: localhost:3001/reminders in your browser 🚀"
  );
});
