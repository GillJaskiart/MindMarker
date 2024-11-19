const database = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    role: "admin",
    reminders: [
      {
        id: 1,
        title: "buy milk",
        description: "go to safeway and buy milk",
        completed: false,
      },
    ],
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    role: "user",
    reminders: [
      {
        id: 1,
        title: "buy apples",
        description: "go to safeway and buy milk",
        completed: false,
      },
    ],
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    role: "user",
    reminders: [
      {
        id: 1,
        title: "buy oranges",
        description: "go to safeway and buy milk",
        completed: false,
      },
    ],
  },
];

const userModel = {
  findOne: (email) => {
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  findById: (id) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    // throw new Error(`Couldn't find user with id: ${id}`);
  },
  create: (newUser) => {
    console.log("adding the new gitHub user!");
    database.push(newUser);
    console.log(database);
    return newUser;
  },
};

module.exports = { database, userModel };
