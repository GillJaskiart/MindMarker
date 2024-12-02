const { PrismaClient } = require("@prisma/client");
const express = require("express");

const db = new PrismaClient();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const reminders = await db.reminder.findMany({
    where: { userId: 1 },
  });
  res.render("index", { reminders });
});

app.post("/reminders", async (req, res) => {
  const { title, description, completed } = req.body;
  const userId = 1; // Change this to be the id of the user from your passport session
  await db.reminder.create({
    data: { title, description, completed, user: { connect: { id: userId } } },
  });
  res.redirect("/");
});

app.listen(8081, () =>
  console.log("Server is running at http://localhost:8081")
);
