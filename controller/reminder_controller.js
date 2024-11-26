let database = require("../database");

let remindersController = {
  list: (req, res) => {
    res.render("reminder/index", { reminders: database.cindy.reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: database.cindy.reminders });
    }
  },

  create: (req, res) => {
    let reminder = {
      id: database.cindy.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    database.cindy.reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    // implement this code
    // console.log(req.params)
    // console.log(req.body)

    // getting the reminder's id
    const reminderId = parseInt(req.params.id)

    const reminderToEdit = database.cindy.reminders.find( (reminder) => reminder.id === reminderId)
    if (reminderToEdit) {
      reminderToEdit.title = req.body.title
      reminderToEdit.description = req.body.description
      reminderToEdit.completed = req.body.completed === "true" ? true : false
    } else {
      console.log(`Reminder with ID ${reminderId} not found`);
  }
    res.redirect("/reminders");
  },

  delete: (req, res) => {
    // Implement this code
    // console.log(req.params)
    // console.log(req.body)
    const reminderId = parseInt(req.params.id)

    const reminderToDelete = database.cindy.reminders.find( (reminder) => reminder.id === reminderId)
    if (reminderToDelete) {
      for (let i = database.cindy.reminders.length - 1; i >= 0; i--) {
        if (database.cindy.reminders[i] === reminderToDelete) {
          database.cindy.reminders.splice(i, 1);
        }
    }
    } else {
      console.log(`Reminder with ID ${reminderId} not found`);
    }
    res.redirect("/reminders");
  }, 
};

module.exports = remindersController;
