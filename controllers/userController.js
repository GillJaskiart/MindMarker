const userModel = require("../models/userModel").userModel;

/**
 * This fucntion will talk to the 'userModel' file and send the email.
 * fincOne() will check if the email exists in the database.
 */
const getUserByEmailIdAndPassword = (email, password) => { //(email, password) is the data that is coming from the browser.
  let user = userModel.findOne(email); // will return the 'user' object if the email exists in the database. eg: {id: 1, name: "Jimmy Smith", email: "jimmy123@gmail.com", password: "jimmy123!"}
  if (user) { // 'user' is coming from the database
    if (isUserValid(user, password)) { // is the password entered matching the password in the database? This function takes the 'user' from the database and the 'password' from the browser.
      return user; // return the 'user' object from the database
    }
  }
  return null;
};
const getUserById = (id) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user, password) {
  return user.password === password; // This function takes the 'user' from the database and the 'password' from the browser.
}

const findOrCreateGitHubUser = (id, username, url, role) => {
  let user = userModel.findGitUserbyId(id)
  if (user) {
    return user
  } else {
    let newUser = userModel.createGitUser(id, username, url)
    // userModel.database.push(newUser)
    return newUser
  }
  // try {
  //   const existingGitUser = userModel.findGitUserbyId(gitHubId)

  //   if (existingGitUser) {
  //     // User found, return the user
  //     return callback(null, existingGitUser);
  //   } else {
  //     // User not found, create new GitHub user
  //     const newGitUser = {
  //       id: userModel.database.length + 1,
  //       gitHubId,
  //       username,
  //       github: true // Mark the user as a GitHub user
  //     };
  //     userModel.database.push(newGitUser); // Add the new user to the database
  //     return callback(null, newGitUser)
  //   }
  // } catch (error) {
  //   callback(error, null); 
  // }
}

module.exports = {
  getUserByEmailIdAndPassword,
  getUserById,
  findOrCreateGitHubUser,
};
