const express = require("express");
const mongoose = require("mongoose");

// Application constants
const app = express();
const PORT = 3000;
const mongoURL = "mongodb+srv://vinaypk07:Sinvin@cluster0.5tnwoyz.mongodb.net/";

//parsing the incoming request body
app.use(express.json());

// connect to mongo DB
mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("DB connection eastiblished!");
  })
  .catch(() => {
    console.log("DB connection failed!");
  });

// sample get request
app.get("/", (req, res) => {
  res.send("Hellow World");
});

// create express server
app.listen(PORT, () => {
  console.log(`Express app running at PORT: ${PORT}`);
});

// register student - post
// login student

// grade a student - post
// get grades of a student in all subjects
// get gradesof student in particular subject
// get graded of all students

// update grade of a student - put
// update details of a student -put

// delete a student -delete
// delete a grade record of a student

// student
// name,email,phone,password

// subject
// name , grade
