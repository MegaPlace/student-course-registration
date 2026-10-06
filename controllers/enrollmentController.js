const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');
const { countBy } = require('../utils/enrollmentCounts');
const { friendly } = require('../utils/errors');

async function formData() {
  const [students, courses, countMap] = await Promise.all([
    Student.find().sort({ studentId: 1 }),
    Course.find().sort({ code: 1 }),
    countBy('course')
  ]);
  return { students, courses, countMap };
}

exports.getAllEnrollments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const enrollments = await Enrollment.find(filter)
      .populate('student')
      .populate('course')
      .sort({ enrolledAt: -1 });

    res.render('enrollments/index', {
      title: 'Registrations',
      enrollments,
      activeStatus: req.query.status || ''
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getNewEnrollmentForm = async (req, res) => {
  const data = await formData();
  res.render('enrollments/new', {
    title: 'New Registration', ...data, error: null, form: {}
  });
};

exports.createEnrollment = async (req, res) => {
  const { student, course } = req.body;
  let error = null;

  try {
    const [studentDoc, courseDoc] = await Promise.all([
      Student.findById(student).catch(() => null),
      Course.findById(course).catch(() => null)
    ]);

    if (!studentDoc || !courseDoc) {
      error = 'Please choose a valid student and a valid course.';
    } else {
      const taken = await Enrollment.countDocuments({
        course: courseDoc._id, status: 'enrolled'
      });

      const duplicate = await Enrollment.findOne({
        student: studentDoc._id,
        course: courseDoc._id,
        semester: courseDoc.semester
      });

      if (taken >= courseDoc.capacity) {
        error = `${courseDoc.code} is full - ${courseDoc.capacity} of ${courseDoc.capacity} seats taken.`;
      } else if (duplicate) {
        error = `${studentDoc.fullName} is already registered for ${courseDoc.code} this semester.`;
      } else {
        await Enrollment.create({
          student: studentDoc._id,
          course: courseDoc._id,
          semester: courseDoc.semester
        });
        return res.redirect('/enrollments');
      }
    }
  } catch (err) {
    error = friendly(err);
  }

  const data = await formData();
  res.status(400).render('enrollments/new', {
    title: 'New Registration', ...data, error, form: req.body
  });
};

exports.updateEnrollment = async (req, res) => {
  try {
    const { status, grade } = req.body;
    await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status, grade: grade || null },
      { runValidators: true }
    );
    res.redirect(req.get('Referer') || '/enrollments');
  } catch (err) {
    res.status(400).send('Error updating registration: ' + friendly(err));
  }
};

exports.deleteEnrollment = async (req, res) => {
  try {
    await Enrollment.findByIdAndDelete(req.params.id);
    res.redirect(req.get('Referer') || '/enrollments');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
