const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentController');

router.get('/',         ctrl.getAllStudents);
router.get('/new',      ctrl.getNewStudentForm);
router.post('/',        ctrl.createStudent);
router.get('/:id',      ctrl.getStudentById);
router.get('/:id/edit', ctrl.getEditStudentForm);
router.put('/:id',      ctrl.updateStudent);
router.delete('/:id',   ctrl.deleteStudent);

module.exports = router;
