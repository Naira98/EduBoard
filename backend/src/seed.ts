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

    // Clear existing data
    // await Promise.all([
    //   User.deleteMany({}),
    //   Semester.deleteMany({}),
    //   Course.deleteMany({}),
    //   Announcement.deleteMany({}),
    //   Quiz.deleteMany({}),
    // ]);
    // console.log("Cleared existing data.");

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
      let yearSuffix: string;
      if (year === 1) yearSuffix = "1st";
      else if (year === 2) yearSuffix = "2nd";
      else if (year === 3) yearSuffix = "3rd";
      else yearSuffix = `${year}th`;

      for (let sem = 1; sem <= 2; sem++) {
        const semesterName = `${yearSuffix} Year (Semester ${sem})`;
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
      semester: createdSemesters["2nd Year (Semester 1)"]._id,
    });

    const course3 = new Course({
      name: "Database Systems",
      professors: [professor._id],
      semester: createdSemesters["3rd Year (Semester 1)"]._id,
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

    // --- ANNOUNCEMENTS for 1st Year (Semester 1) ---
    const announcement1 = new Announcement({
      title: "Welcome to the New Semester!",
      content:
        "All students, welcome to the new academic year. Exciting things await!",
      author: manager._id,
      semester: createdSemesters["1st Year (Semester 1)"]._id,
    });

    const announcement2 = new Announcement({
      title: "Quiz 1 for Intro to CS - Now Available",
      content:
        "The first quiz for Introduction to Computer Science has been posted. Check the Quizzes section.",
      author: professor._id,
      semester: createdSemesters["1st Year (Semester 1)"]._id,
    });

    const announcement3 = new Announcement({
      title: "Reminder: Academic Advising Sessions",
      content:
        "Schedule your academic advising session for course planning. Check your university email for details.",
      author: manager._id,
      semester: createdSemesters["1st Year (Semester 1)"]._id,
    });

    const announcement4 = new Announcement({
      title: "Lecture Notes for Week 3 Posted",
      content:
        "Lecture notes and additional readings for week 3 of Intro to CS are now available on the course page.",
      author: professor._id,
      semester: createdSemesters["1st Year (Semester 1)"]._id,
    });

    const announcement5 = new Announcement({
      title: "Mid-Term Exam Schedule Release",
      content:
        "The schedule for mid-term exams will be released next week. Prepare accordingly!",
      author: manager._id,
      semester: createdSemesters["1st Year (Semester 1)"]._id,
    });

    const announcement6 = new Announcement({
      title: "Course Registration Reminder (2nd Year)",
      content:
        "Don't forget to register for your courses for the upcoming semester.",
      author: manager._id,
      semester: createdSemesters["2nd Year (Semester 1)"]._id, // Corrected to 2nd Year
    });

    await Promise.all([
      announcement1.save(),
      announcement2.save(),
      announcement3.save(),
      announcement4.save(),
      announcement5.save(),
      announcement6.save(),
    ]);
    console.log("Multiple sample announcements created.");

    // --- QUIZZES for 1st Year (Semester 1) ---

    const quiz1Questions = [
      {
        questionText: "What does CPU stand for?",
        options: [
          "Central Process Unit",
          "Central Processing Unit",
          "Computer Personal Unit",
          "Control Processing Unit",
        ],
        correctAnswer: "Central Processing Unit",
      },
      {
        questionText: "Which of these is an input device?",
        options: ["Monitor", "Printer", "Keyboard", "Speaker"],
        correctAnswer: "Keyboard",
      },
      {
        questionText: "What is the primary function of an operating system?",
        options: [
          "To play games",
          "To manage computer hardware and software resources",
          "To browse the internet",
          "To create documents",
        ],
        correctAnswer: "To manage computer hardware and software resources",
      },
      {
        questionText: "What is RAM?",
        options: [
          "Read Access Memory",
          "Random Access Memory",
          "Ready Access Module",
          "Remote Access Memory",
        ],
        correctAnswer: "Random Access Memory",
      },
    ];

    const quiz2Questions = [
      {
        questionText: "What is an algorithm?",
        options: [
          "A programming language",
          "A set of instructions to solve a problem",
          "A type of computer virus",
          "A database query",
        ],
        correctAnswer: "A set of instructions to solve a problem",
      },
      {
        questionText:
          "Which data structure stores elements in a LIFO (Last In, First Out) manner?",
        options: ["Queue", "Array", "Stack", "Linked List"],
        correctAnswer: "Stack",
      },
      {
        questionText:
          "What is the complexity of searching an element in a sorted array using binary search?",
        options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
        correctAnswer: "O(log n)",
      },
      {
        questionText:
          "Which sorting algorithm has the best worst-case time complexity?",
        options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Insertion Sort"],
        correctAnswer: "Merge Sort",
      },
    ];

    const quiz3Questions = [
      {
        questionText: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High-level Text Machine Language",
          "Hyperlink and Text Markup Language",
          "Home Tool Markup Language",
        ],
        correctAnswer: "Hyper Text Markup Language",
      },
      {
        questionText:
          "Which CSS property is used for changing the font size of text?",
        options: ["text-size", "font-style", "font-weight", "font-size"],
        correctAnswer: "font-size",
      },
      {
        questionText: "What is JavaScript primarily used for?",
        options: [
          "Database management",
          "Server-side scripting only",
          "Adding interactivity to web pages",
          "Styling web pages",
        ],
        correctAnswer: "Adding interactivity to web pages",
      },
      {
        questionText: "Which HTML tag is used to create an unordered list?",
        options: ["<ol>", "<li>", "<ul>", "<dl>"],
        correctAnswer: "<ul>",
      },
    ];

    const quiz1 = new Quiz({
      title: "Intro to CS - Fundamentals Quiz",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      questions: quiz1Questions,
      course: course1._id,
      semester: createdSemesters["1st Year (Semester 1)"]._id,
      creator: professor._id,
    });

    const quiz2 = new Quiz({
      title: "Intro to CS - Logic & Algorithms",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      questions: quiz2Questions,
      course: course1._id,
      semester: createdSemesters["1st Year (Semester 1)"]._id,
      creator: professor._id,
    });

    const quiz3 = new Quiz({
      title: "Intro to CS - Web Basics",
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      questions: quiz3Questions,
      course: course1._id,
      semester: createdSemesters["1st Year (Semester 1)"]._id,
      creator: professor._id,
    });

    const pastQuiz = new Quiz({
      title: "Intro to CS - Past Quiz (Submitted by Student)",
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      questions: quiz1Questions.slice(0, 2),
      course: course1._id,
      semester: createdSemesters["1st Year (Semester 1)"]._id,
      creator: professor._id,
    });

    const quiz4 = new Quiz({
      title: "DSA - Data Structures Quiz",
      dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      questions: quiz2Questions.slice(0, 3),
      course: course2._id,
      semester: createdSemesters["2nd Year (Semester 1)"]._id,
      creator: professor._id,
    });

    await Promise.all([
      quiz1.save(),
      quiz2.save(),
      quiz3.save(),
      pastQuiz.save(),
      quiz4.save(),
    ]);
    console.log("Multiple sample quizzes created.");

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
