const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const expressLayouts = require("express-ejs-layouts");

const app = express();

let newTasks = [];
let workTasks = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);

app.get("/", (req, res) => {
  if (Task.find()) {
    console.log('you have tasks')
  } else {
    console.log('You have no tasks')
  }
  res.render("list", {
    day: date.getDay(),
    newTasks: newTasks,
    title: "Home List",
  });
});

app.post("/", (req, res) => {
  if (req.body.button === "Home List") {
    newTasks.push(req.body.task);
    res.redirect("/");
    const task = new Task({
      name: req.body.task,
    })
    // task.save();
  } else {
    workTasks.push(req.body.task);
    res.redirect("/work");
  }
  console.log(req.body.button);
});

app.get("/work", (req, res) => {
  res.render("list", {
    day: date.getDate(),
    newTasks: workTasks,
    title: "Work List",
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Listening on port 3000...");
});
