const express = require("express");
const router = express.Router();
const {
  getCourseAnalytics,
  getInstructorCoursesAnalytics,
  getCourseStudentsAnalytics,
  getStudentAnalytics,
} = require("../controllers/InstructorAnalytics");
const { auth, isInstructor } = require("../middlewares/auth");

router.get("/course/:courseId", auth, isInstructor, getCourseAnalytics);
router.get("/instructor", auth, isInstructor, getInstructorCoursesAnalytics);
router.get("/course-students/:courseId", auth, isInstructor, getCourseStudentsAnalytics);
router.get("/student/:studentId/:courseId", auth, isInstructor, getStudentAnalytics);

module.exports = router;
