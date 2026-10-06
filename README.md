# Student Course Registration System

CRUD web application built with Node.js, Express, MongoDB, Mongoose and EJS
following the Model-View-Controller architecture.

## Entities
- Students
- Courses
- Enrollments (links a student to a course)

## Setup
    npm install
    node seed.js
    npm run dev
Open http://localhost:3000

## Routes
| Entity | Method | URL | Action |
|--------|--------|-----|--------|
| Student | GET | /students | List |
| Student | GET | /students/new | Form |
| Student | POST | /students | Create |
| Student | GET | /students/:id | Show |
| Student | GET | /students/:id/edit | Form |
| Student | PUT | /students/:id | Update |
| Student | DELETE | /students/:id | Delete |
| Course | ... | /courses... | same pattern |
| Enrollment | GET | /enrollments | List |
| Enrollment | GET | /enrollments/new | Form |
| Enrollment | POST | /enrollments | Create |
| Enrollment | PUT | /enrollments/:id | Update status/grade |
| Enrollment | DELETE | /enrollments/:id | Drop |
