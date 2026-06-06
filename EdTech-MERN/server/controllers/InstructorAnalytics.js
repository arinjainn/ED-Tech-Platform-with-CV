console.log("InstructorAnalytics controller loaded");
const Engagement = require("../models/Engagement");
const Course = require("../models/Course");

exports.getCourseAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to course analytics",
      });
    }

    const records = await Engagement.find({ courseId });

    if (records.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          averageAttention: 0,
          averageWatchTime: 0,
          poorPostureCount: 0,
          totalRecords: 0,
        },
      });
    }

    const averageAttention =
      records.reduce((sum, item) => sum + item.attentionScore, 0) /
      records.length;

    const averageWatchTime =
      records.reduce((sum, item) => sum + item.watchTime, 0) / records.length;

    const poorPostureCount = records.filter((item) =>
      item.postureStatus.includes("Poor"),
    ).length;

    return res.status(200).json({
      success: true,
      data: {
        averageAttention: averageAttention.toFixed(2),
        averageWatchTime: averageWatchTime.toFixed(2),
        poorPostureCount,
        totalRecords: records.length,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getInstructorCoursesAnalytics = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const courses = await Course.find({
      instructor: instructorId,
    });

    const analytics = [];

    for (const course of courses) {
      const records = await Engagement.find({
        courseId: course._id,
      });

      if (records.length === 0) {
        analytics.push({
          courseId: course._id,
          courseName: course.courseName,
          averageAttention: 0,
          averageWatchTime: 0,
          totalStudents: 0,
        });

        continue;
      }

      const averageAttention =
        records.reduce((sum, item) => sum + item.attentionScore, 0) /
        records.length;

      const averageWatchTime =
        records.reduce((sum, item) => sum + item.watchTime, 0) / records.length;

      const uniqueStudents = [
        ...new Set(records.map((item) => item.studentId.toString())),
      ];

      analytics.push({
        courseId: course._id,
        courseName: course.courseName,
        averageAttention: averageAttention.toFixed(2),
        averageWatchTime: averageWatchTime.toFixed(2),
        totalStudents: uniqueStudents.length,
      });
    }

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getCourseStudentsAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to course student analytics",
      });
    }

    const records = await Engagement.find({
      courseId,
    }).populate("studentId");

    const studentMap = {};

    records.forEach((record) => {
      const studentId = record.studentId._id.toString();

      if (!studentMap[studentId]) {
        studentMap[studentId] = {
          studentId,
          studentName: `${record.studentId.firstName} ${record.studentId.lastName}`,
          totalAttention: 0,
          totalWatchTime: 0,
          records: 0,
        };
      }

      studentMap[studentId].totalAttention += record.attentionScore;

      studentMap[studentId].totalWatchTime += record.watchTime;

      studentMap[studentId].records += 1;
    });

    const students = Object.values(studentMap).map((student) => ({
      studentId: student.studentId,
      studentName: student.studentName,
      averageAttention: (student.totalAttention / student.records).toFixed(2),
      averageWatchTime: (student.totalWatchTime / student.records).toFixed(2),
    }));

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getStudentAnalytics = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to student behaviour analytics",
      });
    }

    const records = await Engagement.find({
      studentId,
      courseId,
    });

    if (records.length === 0) {
      return res.status(200).json({
        success: true,
        data: {},
      });
    }

    const averageAttention =
      records.reduce((sum, item) => sum + item.attentionScore, 0) /
      records.length;

    const averageWatchTime =
      records.reduce((sum, item) => sum + item.watchTime, 0) / records.length;

    const lookingLeft = records.filter(
      (item) => item.headDirection === "Looking Left",
    ).length;

    const lookingRight = records.filter(
      (item) => item.headDirection === "Looking Right",
    ).length;

    const lookingScreen = records.filter(
      (item) => item.headDirection === "Looking At Screen",
    ).length;

    const goodPosture = records.filter((item) =>
      item.postureStatus.includes("Good"),
    ).length;

    const poorPosture = records.filter((item) =>
      item.postureStatus.includes("Poor"),
    ).length;

    return res.status(200).json({
      success: true,
      data: {
        averageAttention: averageAttention.toFixed(2),

        averageWatchTime: averageWatchTime.toFixed(2),

        lookingLeft,
        lookingRight,
        lookingScreen,

        goodPosture,
        poorPosture,

        totalSessions: records.length,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
