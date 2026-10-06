const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/courseController');

router.get('/',         ctrl.getAllCourses);
router.get('/new',      ctrl.getNewCourseForm);
router.post('/',        ctrl.createCourse);
router.get('/:id',      ctrl.getCourseById);
router.get('/:id/edit', ctrl.getEditCourseForm);
router.put('/:id',      ctrl.updateCourse);
router.delete('/:id',   ctrl.deleteCourse);

module.exports = router;
