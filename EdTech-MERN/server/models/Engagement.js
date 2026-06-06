const mongoose = require("mongoose");

const engagementSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },

  attentionScore: Number,

  headDirection: String,

  postureStatus: String,

  watchTime: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Engagement", engagementSchema);
