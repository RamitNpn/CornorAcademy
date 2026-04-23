import React, { useEffect, useState } from 'react';
import { courseAPI } from '../api/enrollment';

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'College',
    duration: '4 weeks',
    price: 0,
  });
  const [videoData, setVideoData] = useState({
    title: '',
    videoFile: null,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAllCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVideoChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'videoFile') {
      setVideoData({ ...videoData, videoFile: files[0] });
    } else {
      setVideoData({ ...videoData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await courseAPI.updateCourse(editingId, formData);
        alert('Course updated successfully');
      } else {
        await courseAPI.createCourse(formData);
        alert('Course created successfully');
      }
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Error saving course');
    }
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!videoData.videoFile || !videoData.title) {
      alert('Please fill all fields');
      return;
    }

    try {
      setUploadingVideo(true);
      await courseAPI.uploadVideo(selectedCourseId, videoData.videoFile, videoData.title);
      alert('Video uploaded successfully');
      setVideoData({ title: '', videoFile: null });
      setShowVideoForm(false);
      fetchCourses();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Error uploading video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleEdit = (course) => {
    setFormData({
      title: course.title,
      description: course.description,
      level: course.level,
      duration: course.duration,
      price: course.price,
    });
    setEditingId(course._id);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.deleteCourse(courseId);
        alert('Course deleted successfully');
        fetchCourses();
      } catch (error) {
        console.error('Error:', error);
        alert('Error deleting course');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      level: 'College',
      duration: '4 weeks',
      price: 0,
    });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
            <p className="text-gray-600 mt-2">Create, edit, and manage courses and videos</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            + Create Course
          </button>
        </div>

        {/* Form Modal for Course */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? 'Edit Course' : 'Create New Course'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Course Title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Course Description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="School">School</option>
                  <option value="College">College</option>
                  <option value="University">University</option>
                  <option value="Professional">Professional</option>
                </select>
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration (e.g., 4 weeks)"
                  value={formData.duration}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price (0 for free)"
                  value={formData.price}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Form Modal for Video Upload */}
        {showVideoForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Upload Video</h2>
              <form onSubmit={handleVideoUpload} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Video Title"
                  value={videoData.title}
                  onChange={handleVideoChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <input
                  type="file"
                  name="videoFile"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={uploadingVideo}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                  >
                    {uploadingVideo ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowVideoForm(false);
                      setVideoData({ title: '', videoFile: null });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">No courses found</div>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <div className="h-40 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  {course.image ? (
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-4xl">📚</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 truncate">{course.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{course.description}</p>
                  
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{course.level}</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {course.videos?.length || 0} Videos
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {course.enrolledStudents?.length || 0} Students
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourseId(course._id);
                        setShowVideoForm(true);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-semibold"
                    >
                      Add Video
                    </button>
                    <button
                      onClick={() => handleEdit(course)}
                      className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageCourses;