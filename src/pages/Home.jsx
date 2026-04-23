import React from "react";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div className="bg-white text-gray-900">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        
        <span className="text-sm font-medium text-gray-500 tracking-wide">
          🚀 Corner Tech Learning System
        </span>

        <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
          Learn skills that actually <br />
          <span className="text-black">build your future</span>
        </h1>

        <p className="mt-5 text-gray-600 max-w-2xl text-base md:text-lg">
          A modern LMS for developers, students, and creators. Learn web dev, AI, and real-world tech skills step by step.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <NavLink
            to="/courses"
            className="px-6 py-3 bg-black text-white rounded-xl hover:opacity-90 transition font-medium"
          >
            Start Learning
          </NavLink>

          <NavLink
            to="/about"
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition font-medium"
          >
            Explore Platform
          </NavLink>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="border-y bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

          <div>
            <h3 className="text-2xl font-bold">10K+</h3>
            <p className="text-gray-600 text-sm mt-1">Active Learners</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold">120+</h3>
            <p className="text-gray-600 text-sm mt-1">Structured Courses</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold">50+</h3>
            <p className="text-gray-600 text-sm mt-1">Expert Mentors</p>
          </div>

        </div>
      </section>

      {/* COURSES */}
      <section className="max-w-6xl mx-auto px-6 py-24">

        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold">Featured Courses</h2>
            <p className="text-gray-600 text-sm mt-1">
              Hand-picked learning paths for you
            </p>
          </div>

          <NavLink
            to="/courses"
            className="text-sm font-medium text-black hover:underline"
          >
            View all →
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD */}
          {[
            {
              title: "Web Development",
              desc: "React, Node, APIs, and real projects",
            },
            {
              title: "Python & AI",
              desc: "Automation, AI basics, and backend logic",
            },
            {
              title: "UI/UX Design",
              desc: "Modern interfaces and product thinking",
            },
          ].map((course, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-gray-200 hover:shadow-md hover:-translate-y-1 transition duration-300 cursor-pointer bg-white"
            >
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{course.desc}</p>

              <div className="mt-5 text-sm font-medium text-black">
                Start Learning →
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold">
            Ready to start your journey?
          </h2>

          <p className="text-gray-300 mt-3">
            Join Corner Tech LMS and start building real skills today.
          </p>

          <NavLink
            to="/register"
            className="inline-block mt-6 px-6 py-3 bg-white text-black rounded-xl font-medium hover:opacity-90 transition"
          >
            Get Started
          </NavLink>
        </div>
      </section>

    </div>
  );
}

export default Home;