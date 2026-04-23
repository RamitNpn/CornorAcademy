const API = "http://localhost:5000/api/profile";

/**
 * 👤 logged-in user profile
 */
export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

/**
 * 🌐 public user profile by ID
 */
export const getUserById = async (id) => {
  const res = await fetch(`${API}/user/${id}`);
  return res.json();
};

/**
 * ✏️ update profile
 */
export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};