import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";

function Navbar() {
  const text = "Corner Academy";

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Courses", path: "/courses" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔐 AUTH STATE
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setUser({ token }); // later you can decode JWT for name/email
    }

    setLoading(false);
  }, []);

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <h2 className="text-2xl font-bold text-gray-900">{text}</h2>

        {/* NAV LINKS */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-black border-b-2 border-black pb-1"
                    : "text-gray-600 hover:text-black"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-3">

          {/* 🔥 IF USER LOGGED IN */}
          {user ? (
            <div className="flex items-center gap-3">

              {/* PROFILE ICON */}
              <button
                onClick={() => navigate("/profile")}
                className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition"
              >
                <User size={18} />
              </button>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-100"
              >
                Logout
              </button>

            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-4 py-1.5 text-sm rounded-lg border text-black hover:bg-gray-100"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="px-4 py-1.5 text-sm rounded-lg bg-black text-white hover:opacity-90"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-white border-t border-gray-200">

          {/* LINKS */}
          <div className="flex flex-col gap-3">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 text-sm font-medium hover:text-black"
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* AUTH MOBILE */}
          <div className="flex flex-col gap-2 pt-2">

            {user ? (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="px-4 py-2 text-sm border rounded-lg"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-black text-white rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 text-sm border rounded-lg text-center"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 text-sm bg-black text-white rounded-lg text-center"
                >
                  Register
                </NavLink>
              </>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;