import React, { useEffect, useState } from "react";
import { enrollmentAPI, courseAPI } from "../api/enrollment";
import ProgressBar from "../components/ProgressBar";

function Dashboard() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    averageProgress: 0,
    completedCourses: 0,
  });

  // 🔥 check login on page load
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      setShowLogin(false);
      fetchEnrolledCourses();
    } else {
      setShowLogin(true);
      setLoading(false);
    }
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await enrollmentAPI.getMyEnrolledCourses();
      
      if (response.data) {
        setEnrolledCourses(response.data);
        
        // Calculate stats
        const totalCourses = response.data.length;
        const completedCourses = response.data.filter(
          (e) => e.status === "completed"
        ).length;
        const averageProgress =
          totalCourses > 0
            ? Math.round(
                response.data.reduce((sum, e) => sum + e.progress, 0) /
                  totalCourses
              )
            : 0;

        setStats({
          totalCourses,
          completedCourses,
          averageProgress,
        });
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // 🔥 Navigate to login page
    window.location.href = "/login";
  };

  const handleUnenroll = async (enrollmentId) => {
    if (window.confirm("Are you sure you want to unenroll from this course?")) {
      try {
        await enrollmentAPI.unenrollCourse(enrollmentId);
        setEnrolledCourses(
          enrolledCourses.filter((e) => e._id !== enrollmentId)
        );
        alert("Successfully unenrolled from course");
      } catch (error) {
        alert("Error unenrolling from course");
        console.error(error);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* ================= DASHBOARD ================= */}
      <div
        className={`max-w-6xl mx-auto px-6 py-10 transition-all duration-300 ${
          !isLoggedIn ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Corner Tech LMS Dashboard 🚀
            </h1>
            <p className="text-gray-600 mt-2">
              Your learning progress overview
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-700">My Courses</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.totalCourses}
            </p>
            <p className="text-gray-500 text-sm mt-1">Active Enrollments</p>
          </div>

          <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-700">
              Average Progress
            </h2>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.averageProgress}%
            </p>
            <p className="text-gray-500 text-sm mt-1">Overall Completion</p>
          </div>

          <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-700">
              Courses Completed
            </h2>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.completedCourses}
            </p>
            <p className="text-gray-500 text-sm mt-1">Finished Courses</p>
          </div>
        </div>

        {/* ENROLLED COURSES */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Enrolled Courses
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading your courses...</p>
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                No courses enrolled yet 📚
              </p>
              <a
                href="/courses"
                className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Browse Courses
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((enrollment) => (
                <div
                  key={enrollment._id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  {/* Course Image */}
                  <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    {enrollment.course?.image ? (
                      <img
                        src={enrollment.course.image}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-4xl">📚</span>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900">
                      {enrollment.course?.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {enrollment.course?.description}
                    </p>

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Progress
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {enrollment.progress}%
                        </span>
                      </div>
                      <ProgressBar progress={enrollment.progress} />
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          enrollment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : enrollment.status === "paused"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {enrollment.status?.charAt(0).toUpperCase() +
                          enrollment.status?.slice(1)}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="mt-4 flex gap-2">
                      <a
                        href={`/learn/${enrollment.course._id}`}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center text-sm font-semibold"
                      >
                        Continue Learning
                      </a>
                      <button
                        onClick={() => handleUnenroll(enrollment._id)}
                        className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-semibold"
                      >
                        Unenroll
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= LOGIN POPUP ================= */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl text-center">
            <div className="text-4xl">🔐</div>

            <h2 className="text-xl font-bold mt-3">Login Required</h2>

            <p className="text-gray-500 text-sm mt-2">
              Please login to access dashboard and view your enrolled courses
            </p>

            <button
              onClick={handleLogin}
              className="mt-6 w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              Login to Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;