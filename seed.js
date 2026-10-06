require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Promise.all([
      Student.deleteMany({}),
      Course.deleteMany({}),
      Enrollment.deleteMany({})
    ]);

    const students = await Student.insertMany([
      { studentId: 'S1001', firstName: 'Alice',   lastName: 'Johnson', email: 'alice@campus.edu',
        program: 'Computer Science', year: 2 },
      { studentId: 'S1002', firstName: 'Brian',   lastName: 'Lee',     email: 'brian@campus.edu',
        program: 'Computer Science', year: 1 },
      { studentId: 'S1003', firstName: 'Chandra', lastName: 'Patel',   email: 'chandra@campus.edu',
        program: 'Business Administration', year: 3 },
      { studentId: 'S1004', firstName: 'Daniel',  lastName: 'Kim',     email: 'daniel@campus.edu',
        program: 'Computer Science', year: 2 },
      { studentId: 'S1005', firstName: 'Elena',   lastName: 'Rossi',   email: 'elena@campus.edu',
        program: 'Design', year: 1 }
    ]);

    const courses = await Course.insertMany([
      { code: 'CS101',  title: 'Introduction to Programming', instructor: 'Dr. Somchai',
        credits: 3, capacity: 40, semester: '2026-Spring',
        description: 'Variables, control flow, functions and an introduction to objects.' },
      { code: 'CS205',  title: 'Data Structures', instructor: 'Dr. Somchai',
        credits: 3, capacity: 30, semester: '2026-Spring',
        description: 'Lists, stacks, queues, trees, hash tables and complexity analysis.' },
      { code: 'BUS110', title: 'Principles of Marketing', instructor: 'Prof. Napat',
        credits: 3, capacity: 45, semester: '2026-Spring',
        description: 'Market research, segmentation, positioning and the marketing mix.' },
      { code: 'DES150', title: 'Digital Illustration', instructor: 'Prof. Mali',
        credits: 2, capacity: 2, semester: '2026-Spring',
        description: 'Studio course. Small capacity so the full-course rule is easy to demo.' },
      { code: 'MTH101', title: 'Calculus I', instructor: 'Dr. Anan',
        credits: 4, capacity: 35, semester: '2026-Spring',
        description: 'Limits, derivatives, integrals and their applications.' }
    ]);

    const [cs101, cs205, bus110, des150, mth101] = courses;
    const [alice, brian, chandra, daniel, elena] = students;

    await Enrollment.insertMany([
      { student: alice._id,   course: cs101._id,  semester: cs101.semester },
      { student: alice._id,   course: mth101._id, semester: mth101.semester },
      { student: alice._id,   course: des150._id, semester: des150.semester },
      { student: brian._id,   course: cs101._id,  semester: cs101.semester },
      { student: chandra._id, course: bus110._id, semester: bus110.semester },
      { student: daniel._id,  course: cs205._id,  semester: cs205.semester },
      { student: daniel._id,  course: cs101._id,  semester: cs101.semester },
      { student: elena._id,   course: des150._id, semester: des150.semester },
      { student: elena._id,   course: bus110._id, semester: bus110.semester,
        status: 'completed', grade: 'B+' }
    ]);

    console.log('Database seeded');
    console.log(`${students.length} students, ${courses.length} courses, 9 registrations`);
    console.log('NOTE: DES150 has capacity 2 and is already full - useful for your demo.');
    await mongoose.connection.close();
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
})();
