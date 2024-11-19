/**
 ***** ensureAuthenticated *****
 * - 'req.isAuthenticated' is Given to us by passport.
 *      - req.isAuthenticated() checks if the current user has a session
 *      - Returns true if the user has a session, false if the user does not have a session.
 *      - Then we return next() which will allow the user to go to the next middleware or route.
 * - the ensureAuthenticated middleware function is used for protected pages/routes
 */

 /**
  ***** forwardAuthenticated *****
  * - 'req.isAuthenticated' is Given to us by passport.
  * - If the user is already logged in, it does not make sense to show them the login page again. We wand to redirect them to the dashboard page.
  * 
  * 
  * 
  */

// const { activeSessions } = require("../server");
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // if the user is not authenticated (eg logged out), redirect them to the login page
    res.redirect("/auth/login");
  },
  forwardAuthenticated: function (req, res, next) {
    // if they are not logged it, we want to show them the login page. (see router.get("/login") in the authRoute.js file)
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  },
  isAdmin: function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === "admin") {
      // Redirect to another page if the user is not an admin
      return next()  // Or redirect to any other page
    }
    res.redirect("/auth/login");  // proceed to the next step if the user is an admin
  },
};
