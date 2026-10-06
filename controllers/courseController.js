const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { countBy } = require('../utils/enrollmentCounts');
const { friendly } = require('../utils/errors');

exports.getAllCourses = async (req, res) => {
  try {
    const [courses, countMap] = await Promise.all([
      Course.find().sort({ code: 1 }),
      countBy('course')
    ]);
    res.render('courses/index', { title: 'Courses', courses, countMap });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getNewCourseForm = (req, res) => {
  res.render('courses/new', { title: 'Add Course', error: null, form: {} });
};

exports.createCourse = async (req, res) => {
  try {
    await Course.create(req.body);
    res.redirect('/courses');
  } catch (err) {
    res.status(400).render('courses/new', {
      title: 'Add Course', error: friendly(err), form: req.body
    });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).render('404', { title: 'Not Found' });

    const roster = await Enrollment.find({ course: course._id })
      .populate('student')
      .sort({ enrolledAt: 1 });

    const seatsTaken = roster.filter(r => r.status === 'enrolled').length;
    const seatsLeft = course.capacity - seatsTaken;

    res.render('courses/show', {
      title: course.code, course, roster, seatsTaken, seatsLeft
    });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).render('404', { title: 'Not Found' });
    res.status(500).send('Server Error');
  }
};

exports.getEditCourseForm = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).render('404', { title: 'Not Found' });
    res.render('courses/edit', { title: 'Edit Course', course, error: null, form: course });
  } catch (err) {
    res.status(404).render('404', { title: 'Not Found' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!course) return res.status(404).render('404', { title: 'Not Found' });
    res.redirect(`/courses/${course._id}`);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).render('404', { title: 'Not Found' });

    const existing = await Course.findById(req.params.id);
    if (!existing) return res.status(404).render('404', { title: 'Not Found' });

    res.status(400).render('courses/edit', {
      title: 'Edit Course',
      course: existing,
      error: friendly(err),
      form: Object.assign(existing.toObject(), req.body)
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Enrollment.deleteMany({ course: req.params.id });
    await Course.findByIdAndDelete(req.params.id);
    res.redirect('/courses');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
