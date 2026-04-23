import React from "react";
import { useNavigate } from "react-router-dom";

function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/course/${course._id}`)}
      className="border rounded-xl p-4 cursor-pointer hover:shadow-md hover:-translate-y-1 transition"
    >
      <img
        src={course.image || course.thumbnail || "/default-course.png"}
        alt={course.title}
        className="w-full h-40 object-cover rounded-lg"
      />

      <h2 className="mt-3 font-semibold">{course.title}</h2>

      <p className="text-sm text-gray-500 mt-1">
        {course.instructor?.name || course.instructor || "Unknown Instructor"}
      </p>
    </div>
  );
}

export default CourseCard;