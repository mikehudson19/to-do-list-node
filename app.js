if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} 

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const _ = require('lodash');

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

// Connect to the 'tasksDB' DB using Mongoose, create the DB if it isnt there already.
mongoose.connect('mongodb+srv://mikehudson19:nineteen19@cluster0.hv9jl.mongodb.net/tasksDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create task schema for MongoDB
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// Create a new collection
const Task = mongoose.model("Task", taskSchema);

// Create a List Schema
const listSchema = {
  name: String,
  items: [taskSchema],
};

const List = mongoose.model("List", listSchema);

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);

// Default Tasks for Example Purposes
const task1 = new Task({
  name: "Task One",
});

const task2 = new Task({
  name: "Task Two",
});

const task3 = new Task({
  name: "Task Three",
});

const defaultItems = [task1, task2, task3];


// Home Route
app.get("/", (req, res) => {
  Task.find({}, (err, tasks) => {
    if (err) {
      throw new Error();
    } else {
      res.render("list", {
        day: date.getDay(),
        tasks: tasks,
        title: "Home List",
      });
    }
  });
});

// Create Operation
app.post("/", (req, res) => {
  const itemName = req.body.task;
  const listName = req.body.list; // the 'name' attribute on the submit button
  const task = new Task({
    name: itemName,
  });
  if (listName === "Home List") {
    task.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(task); // Using the 'items' property on the 'listSchema' schema.
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

// Delete Operations
app.post("/delete", (req, res) => {
  if (Task.find()) {
    mongoose.connection.db.dropDatabase((err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result + " Success");
      }
    });
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

app.post("/deleteOne", (req, res) => {
  const checkedTaskId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === 'Home List') {
    Task.findByIdAndRemove(checkedTaskId, (err) => {
      if (err) throw new Error();
      console.log("Delete was a success");
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedTaskId}}}, (err, foundList) => {
      if (!err) {
        res.redirect('/' + listName);
      }
    })
  }
});


// Create custom lists using route paramaters
app.get("/:customList", (req, res) => {
  const customListName = _.capitalize(req.params.customList);
  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          day: date.getDay(),
          title: foundList.name,
          tasks: foundList.items,
        });
      }
    }
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server has successfully started...");
});
