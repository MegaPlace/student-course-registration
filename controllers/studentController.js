const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const { countBy } = require('../utils/enrollmentCounts');
const { friendly } = require('../utils/errors');

exports.getAllStudents = async (req, res) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q : '';
    const searchTerm = query.trim();
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const filter = searchTerm ? {
      $or: [
        { firstName: { $regex: escapedTerm, $options: 'i' } },
        { lastName: { $regex: escapedTerm, $options: 'i' } },
        { studentId: { $regex: escapedTerm, $options: 'i' } }
      ]
    } : {};
    const [students, countMap] = await Promise.all([
      Student.find(filter).sort({ studentId: 1 }),
      countBy('student')
    ]);
    res.render('students/index', { title: 'Students', students, countMap, query, searchTerm });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getNewStudentForm = (req, res) => {
  res.render('students/new', { title: 'Register Student', error: null, form: {} });
};

exports.createStudent = async (req, res) => {
  try {
    await Student.create(req.body);
    res.redirect('/students');
  } catch (err) {
    res.status(400).render('students/new', {
      title: 'Register Student',
      error: friendly(err),
      form: req.body
    });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).render('404', { title: 'Not Found' });

    const enrollments = await Enrollment.find({ student: student._id })
      .populate('course')
      .sort({ enrolledAt: -1 });

    res.render('students/show', {
      title: student.fullName, student, enrollments
    });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).render('404', { title: 'Not Found' });
    res.status(500).send('Server Error');
  }
};

exports.getEditStudentForm = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).render('404', { title: 'Not Found' });
    res.render('students/edit', { title: 'Edit Student', student, error: null, form: student });
  } catch (err) {
    res.status(404).render('404', { title: 'Not Found' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!student) return res.status(404).render('404', { title: 'Not Found' });
    res.redirect(`/students/${student._id}`);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).render('404', { title: 'Not Found' });

    const existing = await Student.findById(req.params.id);
    if (!existing) return res.status(404).render('404', { title: 'Not Found' });

    res.status(400).render('students/edit', {
      title: 'Edit Student',
      student: existing,
      error: friendly(err),
      form: Object.assign(existing.toObject(), req.body)
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await Enrollment.deleteMany({ student: req.params.id });
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/students');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
