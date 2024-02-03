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

// create student schema
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
});

// create model
const StudentModel = mongoose.model("Student", studentSchema);

app.post("/registerStudent", async (req, res) => {
  const student = req.body;
  const studnetData = new StudentModel(student);
  const createdData = await studnetData.save();
  res.status(201).send({
    message: "student registered successfully",
    data: createdData,
  });
});

// login student
app.post("/loginStudent", async (req, res) => {
  const loginObj = req.body;
  let { userName, password } = loginObj;

  if (userName && password) {
    const getStudent = await StudentModel.findOne({
      name: userName,
      password: password,
    }).select("name password");
    if (Object.keys(getStudent).length) {
      res.send({
        message: "user logeed in successful",
        data: getStudent,
      });
    }
  } else {
    res.status(200).status("Student not found");
  }
});

// Subject schema
const subjectSchema = new mongoose.Schema({
  name: String,
});

// Subject model
const SubjectModel = mongoose.model("Subject", studentSchema);

// Method to insert multiple subjects
app.post("/addSubjects", async (req, res) => {
  const subjectArr = req.body;
  if (subjectArr.length) {
    const insertManyRes = await SubjectModel.insertMany(subjectArr);
    console.log(insertManyRes);
    res.send(insertManyRes);
  }
});

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
