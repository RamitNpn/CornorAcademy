import React, { useEffect, useState } from 'react';
import { adminAPI } from '../api/enrollment';

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    level: 'College',
    department: 'Computer Science',
    class: '',
  });

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers(filter);
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update user
        const { password, ...updateData } = formData;
        await adminAPI.updateUser(editingId, updateData);
        alert('User updated successfully');
      } else {
        // Create user
        await adminAPI.createUser(formData);
        alert('User created successfully');
      }
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        level: 'College',
        department: 'Computer Science',
        class: '',
      });
      setShowForm(false);
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Error saving user');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      level: user.level,
      department: user.department,
      class: user.class,
    });
    setEditingId(user._id);
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        alert('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error:', error);
        alert('Error deleting user');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'student',
      level: 'College',
      department: 'Computer Science',
      class: '',
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-gray-600 mt-2">Add, edit, and delete user accounts</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            + Add New User
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          {['student', 'instructor', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === role
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}s
            </button>
          ))}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? 'Edit User' : 'Add New User'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                {!editingId && (
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                )}
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="School">School</option>
                  <option value="College">College</option>
                  <option value="University">University</option>
                  <option value="Professional">Professional</option>
                </select>
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="text"
                  name="class"
                  placeholder="Class/Year"
                  value={formData.class}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
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

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Level</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Department</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-3 text-gray-600">{student.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          student.role === 'admin' ? 'bg-red-100 text-red-800' :
                          student.role === 'instructor' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {student.role.charAt(0).toUpperCase() + student.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-600">{student.level}</td>
                      <td className="px-6 py-3 text-gray-600">{student.department}</td>
                      <td className="px-6 py-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageStudents;