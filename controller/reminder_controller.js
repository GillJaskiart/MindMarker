let database = require("../models/userModel");

// Every time we use db, we are talking to the prisms database
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

let remindersController = {
  list:  async (req, res, user) => {
    const reminders = await db.reminder.findMany({
      where: { userId: req.user.id },
    });
    console.log(reminders);
      
    res.render("reminder/index", { reminders:  reminders});
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: async (req, res) => {
    let reminderToFind = req.params.id;

    // let searchResult = database.database[req.user.id - 1].reminders.find(function (reminder) {
    //   return reminder.id == reminderToFind;
    // });
    let searchResult = await db.reminder.findUnique({
      where: { id: parseInt(reminderToFind) },
    });

    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      let reminders = await db.reminder.findMany({
        where: { userId: req.user.id },
      });
      res.render("reminder/index", { reminders: reminders });
    }
  },

  create: async (req, res) => {
    const user = req.user.id;
    await db.reminder.create({
      data:{
        title: req.body.title,
        description: req.body.description,
        completed: false,
        user: {connect: {id: req.user.id}}
      }
    });
    res.redirect("/reminders");
  },

  edit: async (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = await db.reminder.findUnique({
      where: { id: parseInt(reminderToFind) },
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: async (req, res) => {
    const reminderId = parseInt(req.params.id)

    const reminderToEdit = await db.reminder.findUnique({
      where: { id: parseInt(reminderId) },
    });

    if (reminderToEdit) {
      await db.reminder.update({
        where: { id: parseInt(reminderId) },
        data: {
          title: req.body.title,
          description: req.body.description,
          completed: req.body.completed === "true" ? true : false,
        },
      });
    }
    else {
      console.log(`Reminder with ID ${reminderId} not found`);
    }
    res.redirect("/reminders");
  },

  delete: async (req, res) => {
    const reminderId = parseInt(req.params.id)
    
    if (reminderId == undefined) {
      console.log(`Reminder with ID ${reminderId} not found`);
    } else {
    await db.reminder.delete({
      where: { id: parseInt(reminderId) },
    });
    }

    res.redirect("/reminders");
    
    // if (reminderToDelete) {
    //   for (let i = database.database[req.user.id - 1].reminders.length - 1; i >= 0; i--) {
    //     if (database.database[req.user.id - 1].reminders[i] === reminderToDelete) {
    //       database.database[req.user.id - 1].reminders.splice(i, 1);
    //     }
    // }
    // } else {
    //   console.log(`Reminder with ID ${reminderId} not found`);
    // }
  }, 
};

module.exports = remindersController;
