import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoArrowBackOutline } from "react-icons/io5";

const InstructorAnalytics = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/analytics/instructor",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourses(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  return (
    <div className="p-10 text-white">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/dashboard/instructor")}
          className="p-2 text-richblack-300 hover:text-white transition-all bg-richblack-800 rounded-full border border-richblack-700 hover:bg-richblack-700"
          title="Back to Dashboard"
        >
          <IoArrowBackOutline size={20} />
        </button>
        <h1 className="text-3xl font-bold">AI Course Analytics</h1>
      </div>

      <div className="flex flex-col gap-6">
        {courses.map((course) => (
          <div
            key={course.courseId}
            onClick={() => navigate(`/dashboard/analytics/${course.courseId}`)}
            className="bg-richblack-800 p-6 rounded-lg border border-richblack-600 cursor-pointer hover:bg-richblack-700 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-3">{course.courseName}</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-richblack-300">Students</p>
                <p className="text-xl">{course.totalStudents}</p>
              </div>

              <div>
                <p className="text-richblack-300">Attention</p>
                <p className="text-xl">{course.averageAttention}%</p>
              </div>

              <div>
                <p className="text-richblack-300">Watch Time</p>
                <p className="text-xl">
                  {Math.floor(course.averageWatchTime / 60)} min
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorAnalytics;
