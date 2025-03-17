import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const MobileMenu = ({ isMenuOpen, setIsMenuOpen, isSignUp }) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isActive = (path) => location.pathname === path;
  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsMenuOpen]);

  const handleNavigation = () => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 right-0 h-full bg-gray-950/60 backdrop-blur-lg z-50 items-center justify-center transition-all duration-300 ease-in-out 
                  ${isMenuOpen ? "w-64 opacity-100 pointer-events-auto" : "w-0 opacity-0 pointer-events-none"}`}
    >
      <button
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-6 left-6 text-4xl text-white focus:outline-none cursor-pointer"
        aria-label="Close Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-7 w-7"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <nav className="flex flex-col items-center space-y-6 mt-16">
        <Link
          to="/"
          onClick={handleNavigation}
          className="text-gray-300 hover:text-white transition-colors text-lg"
        >
          Home
        </Link>
        <Link
          to="/features"
          onClick={handleNavigation}
          className="text-gray-300 hover:text-white transition-colors text-lg"
        >
          Features
        </Link>
        <Link
          to="/about"
          onClick={handleNavigation}
          className="text-gray-300 hover:text-white transition-colors text-lg"
        >
          About
        </Link>
        <Link
          to="/contact"
          onClick={handleNavigation}
          className="text-gray-300 hover:text-white transition-colors text-lg"
        >
          Contact
        </Link>
        {isLoggedIn && (
          <>
            <Link
              to="/dashboard"
              onClick={handleNavigation}
              className="text-gray-300 hover:text-white transition-colors text-lg"
            >
              Dashboard
            </Link>
            <Link
              to="/chat"
              onClick={handleNavigation}
              className="text-gray-300 hover:text-white transition-colors text-lg"
            >
              Chat
            </Link>
          </>
        )}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-white transition-colors text-lg"
          >
            Logout
          </button>
        ) : (
          <Link
          to={isActive("/signup") ? "/login" : "/signup"}
            onClick={handleNavigation}
            className="text-gray-300 hover:text-white transition-colors text-lg"
          >
            {isActive("/signup") ? "Login" : "Sign Up"}
          </Link>
        )}
      </nav>

      <footer className="absolute bottom-5 p-1 w-full text-center text-gray-300/50 text-sm">
        <p>&copy; {new Date().getFullYear()} Super Agent</p>
      </footer>
    </div>
  );
};
