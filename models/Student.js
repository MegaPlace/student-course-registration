const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String, required: [true, 'Student ID is required'],
    unique: true, trim: true, uppercase: true
  },
  firstName: { type: String, required: [true, 'First name is required'], trim: true },
  lastName:  { type: String, required: [true, 'Last name is required'],  trim: true },
  email: {
    type: String, required: [true, 'Email is required'],
    unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  program: { type: String, trim: true, default: 'Undeclared' },
  year:    { type: Number, min: [1, 'Year must be 1-6'], max: [6, 'Year must be 1-6'], default: 1 },
  createdAt: { type: Date, default: Date.now }
});

studentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
studentSchema.set('toObject', { virtuals: true });
studentSchema.set('toJSON',   { virtuals: true });

module.exports = mongoose.model('Student', studentSchema);
