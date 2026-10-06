const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code:       { type: String, required: [true, 'Course code is required'],
                unique: true, trim: true, uppercase: true },
  title:      { type: String, required: [true, 'Course title is required'], trim: true },
  instructor: { type: String, required: [true, 'Instructor is required'], trim: true },
  credits:    { type: Number, required: true, min: 1, max: 6, default: 3 },
  capacity:   { type: Number, required: true, min: 1, default: 30 },
  semester:   { type: String, required: [true, 'Semester is required'], trim: true },
  description:{ type: String, trim: true },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
