const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student:  { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course:   { type: mongoose.Schema.Types.ObjectId, ref: 'Course',  required: true },
  semester: { type: String, required: true, trim: true },
  status:   { type: String, enum: ['enrolled', 'completed', 'dropped'], default: 'enrolled' },
  grade:    { type: String, enum: ['A', 'B+', 'B', 'C+', 'C', 'D', 'F', null], default: null },
  enrolledAt: { type: Date, default: Date.now }
});

enrollmentSchema.index({ student: 1, course: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
