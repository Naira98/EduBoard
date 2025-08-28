import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { MONGO_URI } from "./config/config";
import { Announcement } from "./models/announcement";
import { Course } from "./models/course";
import { Quiz } from "./models/quiz";
import { Semester } from "./models/semester";
import { User, UserRole } from "./models/user";

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connection successful. Seeding started...");

    const salt = await bcrypt.genSalt(10);
    const managerPassword = await bcrypt.hash("managerpass", salt);
    const professorPassword = await bcrypt.hash("professorpass", salt);
    const studentPassword = await bcrypt.hash("studentpass", salt);

    const manager = new User({
      username: "manager_user",
      email: "manager@test.com",
      password: managerPassword,
      role: UserRole.Manager,
      semester: null,
    });

    const professor = new User({
      username: "professor_user",
      email: "professor@test.com",
      password: professorPassword,
      role: UserRole.Professor,
      semester: null,
    });

    const student = new User({
      username: "student_user",
      email: "student@test.com",
      password: studentPassword,
      role: UserRole.Student,
      semester: null,
    });

    await manager.save();
    await professor.save();
    await student.save();
    console.log("Manager, Professor, and Student users created.");

    const semestersToCreate = [];
    const createdSemesters: { [key: string]: typeof Semester.prototype } = {};

    for (let year = 1; year <= 4; year++) {
      for (let sem = 1; sem <= 2; sem++) {
        const semesterName = `${year}st Year (Semester ${sem})`;
        const newSemester = new Semester({ name: semesterName });
        semestersToCreate.push(newSemester.save());
      }
    }

    const savedSemesters = await Promise.all(semestersToCreate);
    savedSemesters.forEach((s) => {
      createdSemesters[s.name] = s;
    });

    console.log(
      "Semesters created:",
      savedSemesters.map((s) => s.name).join(", ")
    );

    student.semester = createdSemesters["1st Year (Semester 1)"]._id;
    await student.save();
    console.log(
      `Student ${student.username} assigned to ${createdSemesters["1st Year (Semester 1)"].name}`
    );

    const course1 = new Course({
      name: "Introduction to Computer Science",
      professors: [professor._id],
      semester: createdSemesters["1st Year (Semester 1)"]._id,
    });

    const course2 = new Course({
      name: "Data Structures and Algorithms",
      professors: [professor._id],
      semester: createdSemesters["2st Year (Semester 1)"]._id,
    });

    const course3 = new Course({
      name: "Database Systems",
      professors: [professor._id],
      semester: createdSemesters["3st Year (Semester 1)"]._id,
    });

    const course4 = new Course({
      name: "Web Development Fundamentals",
      professors: [professor._id],
      semester: createdSemesters["1st Year (Semester 2)"]._id,
    });

    await course1.save();
    await course2.save();
    await course3.save();
    await course4.save();
    console.log("Sample courses created.");

    const announcement1 = new Announcement({
      title: "Welcome to the New Semester!",
      content:
        "All students, welcome to the new academic year. Exciting things await!",
      author: manager._id,
      semester: createdSemesters["1st Year (Semester 1)"]._id,
    });

    const announcement2 = new Announcement({
      title: "Quiz 1 for Intro to CS",
      content:
        "The first quiz for Introduction to Computer Science has been posted. Check the Quizzes section.",
      author: professor._id,
      semester: createdSemesters["1st Year (Semester 1)"]._id,
    });

    const announcement3 = new Announcement({
      title: "Course Registration Reminder",
      content:
        "Don't forget to register for your courses for the upcoming semester.",
      author: manager._id,
      semester: createdSemesters["2st Year (Semester 1)"]._id,
    });

    await announcement1.save();
    await announcement2.save();
    await announcement3.save();
    console.log("Sample announcements created.");

    const quiz1Questions = [
      {
        questionText: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris",
      },
      {
        questionText: "Which programming language is this code written in?",
        options: ["Python", "Java", "TypeScript", "C++"],
        correctAnswer: "TypeScript",
      },
    ];

    const quiz2Questions = [
      {
        questionText: "What is an array?",
        options: [
          "A type of loop",
          "A data structure",
          "A function",
          "A variable",
        ],
        correctAnswer: "A data structure",
      },
      {
        questionText: "What is Big O notation used for?",
        options: [
          "Styling web pages",
          "Measuring algorithm efficiency",
          "Database querying",
          "Network protocols",
        ],
        correctAnswer: "Measuring algorithm efficiency",
      },
    ];

    const quiz1 = new Quiz({
      title: "Intro to CS - Quiz 1",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      questions: quiz1Questions,
      course: course1._id,
      semester: createdSemesters["1st Year (Semester 1)"]._id,
      creator: professor._id,
    });

    const quiz2 = new Quiz({
      title: "DSA - Quiz 1",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      questions: quiz2Questions,
      course: course2._id,
      semester: createdSemesters["2st Year (Semester 1)"]._id,
      creator: professor._id,
    });

    await quiz1.save();
    await quiz2.save();
    console.log("Sample quizzes created.");

    console.log("Seeding complete! All data types have been created.");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedDatabase();
