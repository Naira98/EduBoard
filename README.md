# EduBoard

A student platform for quizzes and announcements data for the current semester

---

## Technologies Used

### Frontend

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript.
- **Material-UI (MUI)**: React UI framework.
- **Redux**: State management library (`@reduxjs/toolkit`, `react-redux`).
- **React Router DOM**: Declarative routing for React.
- **Jest**: JavaScript testing framework.
- **i18n**: Internationalization for authentication, with future work planned for all pages (`i18next`, `i18next-browser-languagedetector`, `react-i18next`).
- **jwt-decode**: For decoding JWTs.
- **React Toastify**: For toast notifications.
- **React Final Form**: For form management (`final-form`, `react-final-form`).
- **Responsive Design**: Implemented using Material-UI's responsive features.

### Backend

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL document database.
- **Mongoose**: MongoDB ODM for Node.js.
- **bcrypt**: For password hashing.
- **jsonwebtoken**: For JWT-based authentication.
- **typescript**: For TypeScript compilation.

## Features

EduBoard offers distinct functionalities tailored for each user role:

### Student Features

- **Dashboard**: View upcoming quizzes, latest announcements, and overall academic status.
- **Quizzes**: Browse all available quizzes, start new quizzes, and view submitted quiz scores.
- **Announcements**: Read announcements from professors and managers relevant to their enrolled semesters.
- **My Grades**: View a detailed list of all submitted quiz grades and scores.
- **Exam Interface**: An interactive page for taking quizzes with question navigation, answer selection, marking questions, and submission.
- **Role-based Navigation**: Dynamic sidebar tailored to student-specific links.

### Professor Features

- **My Courses**: View courses they are assigned to teach.
- **Manage Quizzes**: View all quizzes they have created, create new quizzes, and manage existing ones.
- **Create Quiz**: A form for creating multi-question quizzes with options and correct answers.
- **View Submissions**: Access a detailed list of student submissions for a specific quiz, including scores and submission times.
- **Manage Announcements**: View announcements they have authored, create new announcements, and manage existing ones.
- **Create Announcement**: A form for publishing new announcements to specific semesters.
- **Role-based Navigation**: Dynamic sidebar tailored to professor-specific links.

### Manager Features

- **Add Users**: Create new user accounts for professors or other managers.
- **Role-based Navigation**: Dynamic sidebar tailored to manager-specific links.

### General Features

- **Authentication & Authorization**: Secure user login with role-based access control.
- **Responsive UI**: Optimized user interface for various screen sizes.
- **Error Handling**: Dedicated "Not Found" (404) and "Access Denied" (403) pages.
- **Centralized State Management**: Uses Redux Toolkit for predictable state management.
- **API Integration**: Seamless communication with a RESTful backend API.
