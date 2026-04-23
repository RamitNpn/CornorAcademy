import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages (create these files)
import Home from './pages/Home'
import Certificate from './pages/Certificate'
import Learn from './pages/Learn'
import Dashboard from './pages/Dashboard'
import NotFound from "./pages/NotFound";
import CourseDetails from "./pages/CourseDetail";
// Layout (optional but clean structure)
import Navbar from "./components/Navbar";
import Courses from "./pages/Courses";
import AdminDashboard from "./admin/AdminDashboard"
import ManageStudents from "./admin/ManageStudents"
import ManageCourses from "./admin/ManageCourses"
import ScrollTop from "./components/ScrollTop";
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import PublicProfile from "./pages/PublicProfile";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<PublicProfile />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-students" element={<ManageStudents />} />
        <Route path="/admin/manage-courses" element={<ManageCourses />} />

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ScrollTop />
    </BrowserRouter>
  );
}

export default App;