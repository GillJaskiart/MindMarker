const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controller/userController");
const { PrismaClient } = require("@prisma/client");
const e = require("express");
const db = new PrismaClient();
const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    // Find user by email
    const user = await db.user.findUnique({
      where: { email:email },
    });

    if (!user) {
      return done(null, false, {
        message: "User not found. Please register or check your login details.",
      });
    }
    if (user.password !== password) {
      return done(null, false, {
        message: "Invalid password. Please try again.",
      });
    }
    // Return the authenticated user
    return done(null, user);
    // const user = await userController.getUserByEmailIdAndPassword(email, password);
    // return user
    //   ? done(null, user)
    //   : done(null, false, {
    //       message: "Your login details are not valid. Please try again",
    //     });
  }
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await db.user.findUnique({
    where: { id:id },
  });
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
  // let user = await userController.getUserById(id);
  // if (user) {
  //   done(null, user);
  // } else {
  //   done({ message: "User not found" }, null);
  // }
});

module.exports = passport.use(localLogin);
