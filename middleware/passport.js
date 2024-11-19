const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const userController = require("../controllers/userController");

// console.log(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET);

const GithubLogin = new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  // console.log(profile) 
  const user = userController.findOrCreateGitHubUser(profile.id, profile.username, profile.profileUrl)
    // id: profile.id, // Prefix GitHub ID with 'github_' to distinguish from local IDs
    // username: profile.login      // GitHub username (login)
  
  return user // Store the profile in the session
    ? done(null, user)
    : done(null, false, {
      message: "Your login details are not valid. Please try again"
    });
}
)

/**
 * Code to set up the local strategy for passport
 * By default the local strategy assumes we use 'username' and 'password' for authentication
 * 
 */
const localLogin = new LocalStrategy( //4.
  {
    usernameField: "email", // tells passport to we are using an 'email' and not a 'username'. Would not be necessary if we were using a 'username'.
    passwordField: "password",  // not required, can be added to be more explicit
  },
  // done: is given to us by passport. It is a callback function that we need to call when we are done.
  // It is our resposibility to check the database to see if the user exists and if the password is correct.
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    // user = {id: 1, name: "Jimmy Smith", email: "jimmy123@gmail.com", password: "jimmy123!"} for eg, assuming no errors occured.
    return user
      ? done(null, user) // if user=true, meaning the user was found and the password matched, then we call done() with null and the user object. 
      // The user object is sent back to the 'passport.authenticate()' function in the 'authRoute.js' file.
      : done(null, false, { // if user=false, meaning the user was not found or the password did not match, then we call done() with null, false and an error message. Not finding the user is not an error, so we pass null.
          message: "Your login details are not valid. Please try again",
        });
  }
);

/*
 *** SerializeUser ****
  * Creates a session.
  * We want the session to be lightweight, so we only store the user's id, it is a unique identifier for the user.
  * For a user to be logged in, we need to create a session.
  * A session is a way of storing on the browser information about the user. It tells the browser to remember the user.
 * The user object we got from the database is sent as the 1st parameter to done().
 * 'null' says there is no error.
 * for eg: user = {id: 1, name: "Jimmy Smith", email: "jimmy123@gmail.com", password: "jimmy123!"}
 * We will only store '1' in the session.
 * The session is saved as: req.session.passport.user = {id: '1'}
 * Every user that logs in will have a session created for them, the session is unique for every user.
 
 * Will store the user object in a variable called 'req.user'. Eg: req.user = {id: 1, name: "Jimmy Smith", email: "jimmy123@gmail.com", password: "jimmy123!"}
 */
passport.serializeUser(function (user, done) {
  // If it's a GitHub user, store their GitHub ID
  if (user.githubId) {
    done(null, user.githubId);  // Save the GitHub ID in the session
  } else {
  done(null, user.id)};
});

/**
 * The server hardrive stores sessions with strings pointing to the user's id.
 * When the user makes a request to login, the browser checks the session id and tries to match it with a session id stored on the server.
 
 */

/**
 ****deserializeUser****
 * When we refresh the page, we are not calling 'Login' anymore, since we already have a session.
 * It is called Anytime a user goes to a protected page, passport will check the cookie in the browser.
 *   - That cookie contains a unique session id, and will be sent to the server.
 *   - Since we currently have a session for the user, the session on the server gets matched to the sid on the browser.
 *   -  deserializeUser() will be called and will get the id stored from the session.
 *   - deserializeUser() will get the user object from the database. It will use the findUserById() function from the userController.js file.
 * 
 * It will get the email of the user.
 * Will check if we have a user in the database that matches the email.
 * If we chose to use the user's id to store in the session (from serializeUser()), deserializeUser() will receive that  id.
 *  Will reattach the user object to req.user. eg: req.user = {id: 1, name: "Jimmy Smith", email: "jimmy123@gmail.com", password: "jimmy123!"} if he exists in the database.
 * 
 * Ensures we have the latest and most up-to-date information about the user.
 */
passport.deserializeUser(function (id, done) {
  // new Promise((resolve, reject) => {
  //   userController.getUserById(id, (err, user) => {
  //     if (err) {
  //       reject (err)
  //     } else {
  //       resolve(user)
  //     }
  //   });
  // })
  // .then(user => {
  //   if (user) {
  //     done(null, user); // local user found
  //   } else {
  //     let githubUser = { githubId: id }; // GitHub user
  //     done(null, githubUser)
  //   }
  // })
  // .catch(err => done(err, null))
  let user = userController.getUserById(id);
  // let gitUser = userController.findOrCreateGitHubUser(id, profile.login)
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

// We are telling passport to use the local strategy we defined above.
// This code is going to return an instance of passport.
// It will configure passport with our local strategy, and will return our newly configured passport library

// module.exports = passport.use(localLogin)
passport.use(localLogin);
passport.use(GithubLogin);
module.exports = passport; 
