import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoArrowBackOutline } from "react-icons/io5";
import { analyticsEndpoints } from "../services/apis";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StudentAnalytics = () => {
  const { studentId, courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { STUDENT_ANALYTICS_API } = analyticsEndpoints;
        const response = await axios.get(
          STUDENT_ANALYTICS_API(studentId, courseId),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (token && studentId && courseId) {
      fetchAnalytics();
    }
  }, [studentId, courseId, token]);

  if (!data) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Formatting Gaze Data for Pie Chart
  const gazeData = [
    { name: "Looking At Screen", value: data.lookingScreen || 0 },
    { name: "Looking Left", value: data.lookingLeft || 0 },
    { name: "Looking Right", value: data.lookingRight || 0 },
  ].filter((item) => item.value > 0);

  const GAZE_COLORS = ["#E7C009", "#4B69C1", "#838894"];

  // Posture Data for Bar Chart
  const postureData = [
    { name: "Good Posture", value: data.goodPosture || 0, fill: "#05A35C" },
    { name: "Poor Posture", value: data.poorPosture || 0, fill: "#EF476F" },
  ];

  const hasChartData =
    (data.lookingScreen || 0) +
      (data.lookingLeft || 0) +
      (data.lookingRight || 0) +
      (data.goodPosture || 0) +
      (data.poorPosture || 0) >
    0;

  return (
    <div className="p-10 text-white min-h-screen bg-richblack-900 font-inter">
      {/* Header section with back button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(`/dashboard/analytics/${courseId}`)}
          className="p-2 text-richblack-300 hover:text-white transition-all bg-richblack-800 rounded-full border border-richblack-700 hover:bg-richblack-700"
          title="Back to Students list"
        >
          <IoArrowBackOutline size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Student Behaviour Analytics</h1>
          <p className="text-richblack-300 mt-1">
            Real-time visual attention & posture metrics
          </p>
        </div>
      </div>

      {/* Summary stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700 shadow-md flex flex-col justify-between">
          <p className="text-richblack-300 font-medium uppercase text-xs tracking-wider">
            Average Attention Score
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-yellow-50">
              {data.averageAttention}%
            </span>
          </div>
          <div className="w-full bg-richblack-700 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-yellow-50 h-full rounded-full transition-all duration-500"
              style={{ width: `${data.averageAttention}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700 shadow-md flex flex-col justify-between">
          <p className="text-richblack-300 font-medium uppercase text-xs tracking-wider">
            Average Watch Session
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-caribbeangreen-200">
              {Math.floor(data.averageWatchTime / 60)}
            </span>
            <span className="text-richblack-300 text-lg">min</span>
            <span className="text-3xl font-semibold text-caribbeangreen-200 ml-1">
              {Math.floor(data.averageWatchTime % 60)}
            </span>
            <span className="text-richblack-300 text-lg">sec</span>
          </div>
          <p className="text-xs text-richblack-400 mt-4">
            Averaged watch-time logged per video segment
          </p>
        </div>

        <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700 shadow-md flex flex-col justify-between">
          <p className="text-richblack-300 font-medium uppercase text-xs tracking-wider">
            Total Logged Sessions
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-blue-200">
              {data.totalSessions}
            </span>
            <span className="text-richblack-300 text-sm">active checks</span>
          </div>
          <p className="text-xs text-richblack-400 mt-4">
            Interval measurements taken during class video play
          </p>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      {hasChartData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gaze Chart */}
          <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-richblack-5">
              Gaze Direction Distribution
            </h2>
            <p className="text-sm text-richblack-300 mb-6">
              Breakdown of student's focal point direction across check intervals.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gazeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {gazeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={GAZE_COLORS[index % GAZE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161D29",
                      borderColor: "#2C3540",
                      color: "#FFF",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Posture Chart */}
          <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-richblack-5">
              Posture Assessment
            </h2>
            <p className="text-sm text-richblack-300 mb-6">
              Comparison of good posture and slouching alert logs.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={postureData} barSize={40}>
                  <XAxis dataKey="name" stroke="#838894" />
                  <YAxis stroke="#838894" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161D29",
                      borderColor: "#2C3540",
                      color: "#FFF",
                      borderRadius: "8px",
                    }}
                    cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {postureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-richblack-800 p-12 rounded-xl border border-richblack-700 text-center text-richblack-300 shadow-md">
          <p className="text-lg font-semibold">No detailed chart data available.</p>
          <p className="text-sm mt-1">
            Data is gathered incrementally as the student interacts with video modules.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentAnalytics;
