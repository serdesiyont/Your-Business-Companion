import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeaderLogo from "../assets/Logo/SuperAgentLogo.svg";

export const Navbar = ({ isMenuOpen, setIsMenuOpen, isSignUp }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLinkClick = () => {
    setIsSelected(true);
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-gray-950/60 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 py-4">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            <img src={HeaderLogo} alt="Logo" width="100px" />
          </Link>

          <div
            className="w-9 pr-3 h-8 relative cursor-pointer z-40 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-full h-0.5 m-1.5 bg-white mb-1"></div>
            <div className="w-full h-0.5 m-1.5 bg-white mb-1"></div>
            <div className="w-full h-0.5 m-1.5 bg-white"></div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-300 relative group transition-colors ${
                isActive("/") ? "text-blue-500" : ""
              }`}
              onClick={handleLinkClick}
            >
              Home
              <span
                className={`absolute left-0 bottom-0 block h-0.5 bg-gray-500 transition-all duration-300 ${
                  isSelected && isActive("/") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
            <Link
              to="/features"
              className={`text-gray-300 relative group transition-colors ${
                isActive("/features") ? "text-blue-500" : ""
              }`}
              onClick={handleLinkClick}
            >
              Features
              <span
                className={`absolute left-0 bottom-0 block h-0.5 bg-gray-500 transition-all duration-300 ${
                  isSelected && isActive("/features")
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
            <Link
              to="/about"
              className={`text-gray-300 relative group transition-colors ${
                isActive("/about") ? "text-blue-500" : ""
              }`}
              onClick={handleLinkClick}
            >
              About
              <span
                className={`absolute left-0 bottom-0 block h-0.5 bg-gray-500 transition-all duration-300 ${
                  isSelected && isActive("/about")
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
            <Link
              to="/contact"
              className={`text-gray-300 relative group transition-colors ${
                isActive("/contact") ? "text-blue-500" : ""
              }`}
              onClick={handleLinkClick}
            >
              Contact
              <span
                className={`absolute left-0 bottom-0 block h-0.5 bg-gray-500 transition-all duration-300 ${
                  isSelected && isActive("/contact")
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-gray-300 relative group transition-colors ${
                    isActive("/dashboard") ? "text-blue-500" : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  Dashboard
                  <span
                    className={`absolute left-0 bottom-0 block h-0.5 bg-gray-500 transition-all duration-300 ${
                      isSelected && isActive("/dashboard")
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
                <Link
                  to="/chat"
                  className={`text-gray-300 relative group transition-colors ${
                    isActive("/chat") ? "text-blue-500" : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  Chat
                  <span
                    className={`absolute left-0 bottom-0 block h-0.5 bg-gray-500 transition-all duration-300 ${
                      isSelected && isActive("/chat")
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </>
            )}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition-colors border border-gray-300 rounded-lg px-3 py-1 hover:border-white"
              >
                Logout
              </button>
            ) : (
              <Link
                to={isActive("/signup") ? "/login" : "/signup"}
                className="text-gray-300 hover:text-white transition-colors border border-gray-300 rounded-lg px-3 py-1 hover:border-white"
              >
                {isActive("/signup") ? "Login" : "Sign Up"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
