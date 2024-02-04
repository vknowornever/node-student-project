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
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  password: { type: String },
  studentEnrolledSubject: [{ type: mongoose.Schema.Types.ObjectId }],
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
  name: { type: String },
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

// Get All subject and subject with ID -- self

app.post("/getSubjects", async (req, res) => {
  const { id, name } = req.body;
  if (!id && !name) {
    const allGrades = await SubjectModel.find();
    res.send(allGrades);
  } else if (id) {
    const subjectById = await StudentModel.findById(id);
    res.send(subjectById);
  } else {
    const subjectByName = await SubjectModel.find({ name: name });
    res.send(subjectByName);
  }
});

// create grade schema
const gradeSchema = new mongoose.Schema({
  grade: { type: String, require: true, unique: true },
});

// Grade Model
const GradeModel = mongoose.model("Grade", gradeSchema);

// Insert grade

app.post("/addGrade", async (req, res) => {
  const grade = req.body;
  const gradeExist = await GradeModel.findOne(grade);
  // const gradeObject = Object.keys(gradeExist).length && new GradeModel(grade);
  if (!gradeExist) {
    const newGrade = new GradeModel(grade);
    const dbRes = await newGrade.save();
    res.send(dbRes);
  } else {
    res.send("ALready exist");
  }
});

// get all grade or grade by id
app.post("/getGrade", async (req, res) => {
  const { id, grade } = req.body;
  if (!id && !grade) {
    const allGrades = await GradeModel.find().select("_id grade");
    res.send(allGrades);
  } else if (id) {
    const allGradeByID = await GradeModel.findOne({ _id: id }).select(
      "_id grade"
    );
    res.send("Hi", allGradeByID);
  } else {
    const gradeByName = await GradeModel.findOne({ grade: grade }).select(
      "_id grade"
    );
    res.send(gradeByName);
  }
});

// Progress report schema

const progressReportSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId },
  subjects: [
    {
      subject: { type: mongoose.Schema.Types.ObjectId },
      grade: { type: mongoose.Schema.Types.ObjectId },
    },
  ],
});

const ProgressReportModel = mongoose.model(
  "StudentReport",
  progressReportSchema
);

// create student report

app.post("/addStudentReport", async (req, res) => {
  const { student, subjects } = req.body;
  if (subjects.length) {
    // finding the student
    const studentData = await StudentModel.findById(student);

    // getting student enrolled subjects

    const studentSubjects = studentData.studentEnrolledSubject;
    console.log(studentSubjects);

    // checking if the enrollment
    const arr = [];
    subjects.forEach((subject) => {
      studentSubjects.forEach((studentEnrolledSubject) => {
        console.log(subject.subject == studentEnrolledSubject);
        if (subject.subject == studentEnrolledSubject) {
          arr.push(true);
        }
      });
    });

    if (arr.length == subjects.length) {
      const studentGrade = new ProgressReportModel({ student, subjects });
      const saveStudentGrade = await studentGrade.save();
      res.send(saveStudentGrade);
    } else {
      res.send("Record insert failed!");
    }
  }
});

// grade a student - post
// get grades of a student in all subjectsnodemon
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
