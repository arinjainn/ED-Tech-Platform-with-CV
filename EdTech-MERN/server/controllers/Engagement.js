const Engagement = require("../models/Engagement");

exports.saveEngagement = async (req, res) => {
  console.log("ENGAGEMENT API HIT");
  console.log(req.body);

  try {
    const {
      courseId,
      attentionScore,
      headDirection,
      postureStatus,
      watchTime,
    } = req.body;

    const studentId = req.user.id;

    const data = await Engagement.create({
      studentId,
      courseId,
      attentionScore,
      headDirection,
      postureStatus,
      watchTime,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
