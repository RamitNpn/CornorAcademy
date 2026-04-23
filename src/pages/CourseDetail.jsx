import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { courseAPI, enrollmentAPI } from "../api/enrollment";

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    checkEnrollment();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourse(id);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await enrollmentAPI.getMyEnrolledCourses();
      const enrolled = response.data.some((e) => e.course._id === id);
      setIsEnrolled(enrolled);
    } catch (error) {
      // User not logged in or error
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setEnrolling(true);
      await enrollmentAPI.enrollCourse(id);
      alert("Successfully enrolled in course!");
      setIsEnrolled(true);
      checkEnrollment();
    } catch (error) {
      if (error.response?.status === 400) {
        alert("You are already enrolled in this course");
        setIsEnrolled(true);
      } else {
        alert(error.response?.data?.message || "Error enrolling in course");
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Course Image */}
          <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg overflow-hidden mb-8 flex items-center justify-center">
            {course.image ? (
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-6xl">📚</span>
            )}
          </div>

          {/* Course Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>

            <p className="text-gray-600 mt-4 text-lg">{course.description}</p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="px-4 py-2 bg-blue-100 rounded-lg">
                <p className="text-sm text-gray-600">Level</p>
                <p className="font-semibold text-blue-700">{course.level}</p>
              </div>
              <div className="px-4 py-2 bg-green-100 rounded-lg">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-green-700">{course.duration}</p>
              </div>
              <div className="px-4 py-2 bg-purple-100 rounded-lg">
                <p className="text-sm text-gray-600">Videos</p>
                <p className="font-semibold text-purple-700">{course.videos?.length || 0}</p>
              </div>
              <div className="px-4 py-2 bg-orange-100 rounded-lg">
                <p className="text-sm text-gray-600">Students Enrolled</p>
                <p className="font-semibold text-orange-700">
                  {course.enrolledStudents?.length || 0}
                </p>
              </div>
            </div>

            {/* Instructor */}
            {course.instructor && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm">Instructor</p>
                <p className="font-semibold text-lg text-gray-900">
                  {course.instructor.name}
                </p>
                <p className="text-gray-600">{course.instructor.email}</p>
              </div>
            )}

            {/* Enroll Button */}
            <div className="mt-8">
              {isEnrolled ? (
                <div className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg font-semibold">
                  ✓ Already Enrolled
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Course Videos</h2>

        {course.videos && course.videos.length > 0 ? (
          <div className="space-y-6">
            {course.videos.map((video, index) => (
              <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-20 w-20 rounded-lg bg-gradient-to-br from-red-400 to-red-600 text-white text-2xl">
                      ▶
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Duration: {video.duration ? `${Math.round(video.duration)} seconds` : 'Unknown'}
                    </p>
                    {isEnrolled ? (
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                      >
                        Watch Video
                      </a>
                    ) : (
                      <button
                        onClick={handleEnroll}
                        className="inline-block mt-4 px-6 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed font-semibold"
                      >
                        Enroll to Watch
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No videos available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDetails;