import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/profile";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    class: "",
    rollNo: "",
    department: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getProfile();
      setUser(data);

      setForm({
        name: data.name,
        email: data.email,
        class: data.class,
        rollNo: data.rollNo,
        department: data.department,
      });

      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    const res = await updateProfile(form);

    if (res.message) {
      setUser({ ...user, ...form });
      setEditOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">

      <div className="w-full max-w-3xl space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-black text-white flex items-center justify-center rounded-full text-lg font-bold">
              {user?.name?.charAt(0)}
            </div>

            <div>
              <h1 className="text-lg font-semibold">{user?.name}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-green-600 mt-1">
                ● {user?.role}
              </p>
            </div>
          </div>

          {/* ✏️ EDIT BUTTON */}
          <button
            onClick={() => setEditOpen(true)}
            className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:opacity-90"
          >
            Edit Profile
          </button>

        </div>

        {/* ACADEMIC INFO */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Academic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Info label="Department" value={user?.department} />
            <Info label="Class" value={user?.class} />
            <Info label="Roll No" value={user?.rollNo} />
            <Info label="Role" value={user?.role} />

          </div>

        </div>

      </div>

      {/* ✏️ EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">

            <h2 className="text-lg font-semibold">Edit Profile</h2>

            <input
              className="w-full p-2 border rounded-lg"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              className="w-full p-2 border rounded-lg"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="Email"
            />

            <input
              className="w-full p-2 border rounded-lg"
              value={form.class}
              onChange={(e) =>
                setForm({ ...form, class: e.target.value })
              }
              placeholder="Class"
            />

            <input
              className="w-full p-2 border rounded-lg"
              value={form.rollNo}
              onChange={(e) =>
                setForm({ ...form, rollNo: e.target.value })
              }
              placeholder="Roll Number"
            />

            <input
              className="w-full p-2 border rounded-lg"
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
              placeholder="Department"
            />

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 pt-2">

              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/**
 * reusable UI block
 */
function Info({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

export default Profile;