const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/enrollmentController');

router.get('/',       ctrl.getAllEnrollments);
router.get('/new',    ctrl.getNewEnrollmentForm);
router.post('/',      ctrl.createEnrollment);
router.put('/:id',    ctrl.updateEnrollment);
router.delete('/:id', ctrl.deleteEnrollment);

module.exports = router;
