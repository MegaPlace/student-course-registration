require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const connectDB = require('./config/db');

const studentRoutes    = require('./routes/studentRoutes');
const courseRoutes     = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

const Student    = require('./models/Student');
const Course     = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    const [studentCount, courseCount, enrollmentCount, recent] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments({ status: 'enrolled' }),
      Enrollment.find()
        .sort({ enrolledAt: -1 })
        .limit(5)
        .populate('student', 'firstName lastName studentId')
        .populate('course', 'code title')
    ]);

    res.render('dashboard', {
      title: 'Dashboard', studentCount, courseCount, enrollmentCount, recent
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.use('/students',    studentRoutes);
app.use('/courses',     courseRoutes);
app.use('/enrollments', enrollmentRoutes);

app.use((req, res) => res.status(404).render('404', { title: 'Not Found' }));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
