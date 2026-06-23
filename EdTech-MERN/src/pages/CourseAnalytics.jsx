import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoArrowBackOutline } from "react-icons/io5";
import { analyticsEndpoints } from "../services/apis";

const CourseAnalytics = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { COURSE_STUDENTS_ANALYTICS_API } = analyticsEndpoints;
        const response = await axios.get(
          COURSE_STUDENTS_ANALYTICS_API(courseId),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudents(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (token && courseId) {
      fetchStudents();
    }
  }, [courseId, token]);

  return (
    <div className="p-10 text-white">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/analytics")}
          className="p-2 text-richblack-300 hover:text-white transition-all bg-richblack-800 rounded-full border border-richblack-700 hover:bg-richblack-700"
          title="Back to Courses"
        >
          <IoArrowBackOutline size={20} />
        </button>
        <h1 className="text-3xl font-bold">Course Analytics</h1>
      </div>

      <div className="bg-richblack-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 p-4 font-bold border-b border-richblack-600">
          <div>Student</div>
          <div>Attention</div>
          <div>Watch Time</div>
        </div>

        {students.map((student) => (
          <div
            key={student.studentId}
            onClick={() =>
              navigate(`/dashboard/analytics/${courseId}/${student.studentId}`)
            }
            className="grid grid-cols-3 p-4 border-b border-richblack-700 cursor-pointer hover:bg-richblack-700"
          >
            <div>{student.studentName}</div>

            <div>{student.averageAttention}%</div>

            <div>{Math.floor(student.averageWatchTime / 60)} min</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseAnalytics;
