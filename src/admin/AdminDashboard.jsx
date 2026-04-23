import React, { useEffect, useState } from "react";
import { adminAPI } from "../api/enrollment";

function Admin() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "",
    duration: "",
    price: "",
  });
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const response = await adminAPI.getStats();
      setStats(response.data || {});
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await fetch("http://localhost:5000/api/courses");
      const data = await res.json();
      setCourses(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 REQUIRED
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Course uploaded!");
        setForm({
          title: "",
          description: "",
          level: "",
          duration: "",
          price: "",
        });
        fetchCourses();
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.log(err);
      alert("❌ Error uploading course");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage courses, users, and platform analytics</p>
        </div>

        {/* Dashboard Stats */}
        {loadingStats ? (
          <div className="text-center text-gray-500 mb-8">Loading stats...</div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.users?.total || 0}</p>
              <p className="text-gray-500 text-xs mt-1">Registered accounts</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <p className="text-gray-600 text-sm">Students</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.users?.students || 0}</p>
              <p className="text-gray-500 text-xs mt-1">Active learners</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <p className="text-gray-600 text-sm">Total Courses</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.courses || 0}</p>
              <p className="text-gray-500 text-xs mt-1">Published courses</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <p className="text-gray-600 text-sm">Enrollments</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.enrollments || 0}</p>
              <p className="text-gray-500 text-xs mt-1">Total enrollments</p>
            </div>
          </div>
        ) : null}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-semibold">
            📚 Courses
          </button>
          <a
            href="/admin/manage-students"
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
          >
            👥 Manage Users
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Course Creation Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Create Course</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          placeholder="Course Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />

        <input
          name="level"
          placeholder="Level (Beginner)"
          value={form.level}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <input
          name="duration"
          placeholder="Duration (4 weeks)"
          value={form.duration}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <textarea
          name="description"
          placeholder="Course Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          rows="4"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
          Create Course 🚀
        </button>

            </form>
          </div>

          {/* Courses List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Existing Courses ({courses.length})</h2>

            {loadingCourses ? (
              <p className="text-gray-600 text-center py-8">Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No courses found yet. Create your first course!</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {courses.map((course) => (
                  <div key={course._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 flex items-center justify-center">
                        {course.image ? (
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-2xl">📚</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">{course.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{course.description}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {course.level || "N/A"}
                          </span>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {course.duration || "N/A"}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {course.videos?.length || 0} Videos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;