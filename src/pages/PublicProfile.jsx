import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../api/profile";

function PublicProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setUser(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!user || user.message) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        User not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">

      <div className="bg-white shadow-sm rounded-2xl p-8 w-full max-w-md text-center">

        <div className="w-20 h-20 mx-auto bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold">
          {user?.name?.charAt(0)}
        </div>

        <h1 className="mt-4 text-xl font-semibold">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>

        <div className="mt-6 text-sm text-gray-400">
          Public Profile View
        </div>

      </div>

    </div>
  );
}

export default PublicProfile;