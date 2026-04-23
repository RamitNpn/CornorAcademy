const Course = require("../models/Course");
const cloudinary = require("../config/cloudinary");

/**
 * Upload video to Cloudinary
 */
exports.uploadVideoToCloudinary = async (videoPath) => {
  try {
    const result = await cloudinary.uploader.upload(videoPath, {
      resource_type: "video",
      folder: "lms/videos",
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Video upload failed: ${error.message}`);
  }
};

/**
 * Upload image to Cloudinary
 */
exports.uploadImageToCloudinary = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "lms/course-images",
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Create course with image
 */
exports.createCourse = async (courseData) => {
  try {
    const course = await Course.create(courseData);
    return course;
  } catch (error) {
    throw new Error(`Course creation failed: ${error.message}`);
  }
};

/**
 * Add video to course
 */
exports.addVideoToCourse = async (courseId, videoData) => {
  try {
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $push: { videos: videoData } },
      { new: true }
    );
    return course;
  } catch (error) {
    throw new Error(`Failed to add video to course: ${error.message}`);
  }
};

/**
 * Get course with instructor and enrollment details
 */
exports.getCourseDetails = async (courseId) => {
  try {
    const course = await Course.findById(courseId)
      .populate("instructor", "name email bio")
      .populate("enrolledStudents", "name email")
      .lean();
    return course;
  } catch (error) {
    throw new Error(`Failed to fetch course details: ${error.message}`);
  }
};

/**
 * Get courses by level
 */
exports.getCoursesByLevel = async (level) => {
  try {
    const courses = await Course.find({ level, isPublished: true })
      .populate("instructor", "name email")
      .lean();
    return courses;
  } catch (error) {
    throw new Error(`Failed to fetch courses by level: ${error.message}`);
  }
};
