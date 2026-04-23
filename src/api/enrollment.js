import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Add token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Enrollment APIs
 */
export const enrollmentAPI = {
  // Enroll in a course
  enrollCourse: (courseId) =>
    API.post(`/enrollment/enroll/${courseId}`),

  // Get my enrolled courses
  getMyEnrolledCourses: () =>
    API.get("/enrollment/my-courses"),

  // Get enrollment details
  getEnrollmentDetails: (enrollmentId) =>
    API.get(`/enrollment/${enrollmentId}`),

  // Update progress
  updateProgress: (enrollmentId, progress, videoId) =>
    API.put(`/enrollment/${enrollmentId}/progress`, { progress, videoId }),

  // Unenroll from course
  unenrollCourse: (enrollmentId) =>
    API.delete(`/enrollment/${enrollmentId}`),
};

/**
 * Course APIs
 */
export const courseAPI = {
  // Get all courses
  getAllCourses: (level, instructor) =>
    API.get("/admin-courses", {
      params: { level, instructor },
    }),

  // Get single course
  getCourse: (courseId) =>
    API.get(`/admin-courses/${courseId}`),

  // Create course
  createCourse: (courseData) =>
    API.post("/admin-courses/create", courseData),

  // Upload course image
  uploadCourseImage: (courseId, imageFile) => {
    const formData = new FormData();
    formData.append("imageFile", imageFile);
    return API.post(`/admin-courses/${courseId}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Upload video to course
  uploadVideo: (courseId, videoFile, title) => {
    const formData = new FormData();
    formData.append("videoFile", videoFile);
    formData.append("title", title);
    return API.post(`/admin-courses/${courseId}/upload-video`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Update course
  updateCourse: (courseId, courseData) =>
    API.put(`/admin-courses/${courseId}`, courseData),

  // Delete course
  deleteCourse: (courseId) =>
    API.delete(`/admin-courses/${courseId}`),
};

/**
 * Admin User APIs
 */
export const adminAPI = {
  // Get all users
  getAllUsers: (role, level) =>
    API.get("/admin/users", {
      params: { role, level },
    }),

  // Get single user
  getUser: (userId) =>
    API.get(`/admin/users/${userId}`),

  // Create user
  createUser: (userData) =>
    API.post("/admin/users", userData),

  // Update user
  updateUser: (userId, userData) =>
    API.put(`/admin/users/${userId}`, userData),

  // Delete user
  deleteUser: (userId) =>
    API.delete(`/admin/users/${userId}`),

  // Change password
  changeUserPassword: (userId, newPassword) =>
    API.put(`/admin/users/${userId}/change-password`, { newPassword }),

  // Upload profile image
  uploadProfileImage: (userId, imageFile) => {
    const formData = new FormData();
    formData.append("imageFile", imageFile);
    return API.post(`/admin/users/${userId}/profile-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Get dashboard stats
  getStats: () =>
    API.get("/admin/stats"),
};

export default API;
