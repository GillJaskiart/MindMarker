const userModel = require("../models/userModel").userModel;

const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const getUserByEmailIdAndPassword = async (email, password) => {
  let user = await db.user.findUnique({ where: { email: email }})
  if (user) {
    if (isUserValid(user, password)) {
      return user;
    }
  }
  return null;
};
const getUserById = async (id) => {
  let user = await db.user.findUnique({ where: { id: id}});
  if (user) {
    return user;
  }
  return null;
};

const isUserValid = async (user, password) =>  {
  return await db.user.password === password;
}

module.exports = {
  getUserByEmailIdAndPassword,
  getUserById,
};
