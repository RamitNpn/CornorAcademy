import React, { useState } from "react";

function Admin() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "",
    duration: "",
    price: "",
  });

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
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.log(err);
      alert("❌ Error uploading course");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">

      <h1 className="text-2xl font-bold mb-6">
        Admin Panel – Upload Course
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          placeholder="Course Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg"
        />

        <input
          name="level"
          placeholder="Level (Beginner)"
          value={form.level}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg"
        />

        <input
          name="duration"
          placeholder="Duration (4 weeks)"
          value={form.duration}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg"
        />

        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Course Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg"
        />

        <button className="w-full bg-black text-white py-2 rounded-lg">
          Upload Course 🚀
        </button>

      </form>
    </div>
  );
}

export default Admin;