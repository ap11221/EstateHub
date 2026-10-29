import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-lg text-sm font-medium transition ${
        isActive ? "text-brand-700 bg-brand-50" : "text-gray-600 hover:text-brand-700 hover:bg-gray-50"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-brand-700">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            EstateHub
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/listings">Browse</NavItem>
            {user && <NavItem to="/favorites">Favorites</NavItem>}
            {(user?.role === "owner" || user?.role === "admin") && <NavItem to="/my-properties">My Properties</NavItem>}
            {user?.role === "admin" && <NavItem to="/admin">Admin</NavItem>}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login" className="btn-outline btn-sm">Log in</Link>
                <Link to="/register" className="btn-primary btn-sm">Sign up</Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-600">
                  Hi, <span className="font-semibold text-gray-900">{user.name.split(" ")[0]}</span>
                  <span className="badge bg-brand-100 text-brand-700 ml-2 capitalize">{user.role}</span>
                </span>
                <button onClick={handleLogout} className="btn-outline btn-sm">Log out</button>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/listings">Browse</NavItem>
            {user && <NavItem to="/favorites">Favorites</NavItem>}
            {(user?.role === "owner" || user?.role === "admin") && <NavItem to="/my-properties">My Properties</NavItem>}
            {user?.role === "admin" && <NavItem to="/admin">Admin</NavItem>}
            <div className="flex gap-2 mt-2">
              {!user ? (
                <>
                  <Link to="/login" className="btn-outline btn-sm flex-1">Log in</Link>
                  <Link to="/register" className="btn-primary btn-sm flex-1">Sign up</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="btn-outline btn-sm flex-1">Log out</button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
