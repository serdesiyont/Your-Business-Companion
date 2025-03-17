import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Utility function to get a cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setErrors({ name: "", email: "", password: "" });
    // If the user is already authenticated, you may choose to redirect
    const session = getCookie("sessionid");
    if (session) navigate("/login");
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = { name: "", email: "", password: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    if (!validateForm()) return;
    setLoading(true);

    try {
      const url = "/api/register"; // Note the trailing slash
      const csrfToken = getCookie("csrftoken");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        const errorMessage =
          data.non_field_errors?.[0] ||
          Object.values(data).flat().join(", ") ||
          "Registration failed. Please try again later.";
        throw new Error(errorMessage);
      }

      setStatus({
        type: "success",
        message: "Account created successfully! Redirecting to login...",
      });
      // Clear form and redirect after a short delay
      setTimeout(() => {
        setFormData({ name: "", email: "", password: "" });
        navigate("/login");
      }, 2000);
    } catch (err) {
      let errorMsg = err.message;
      if (errorMsg.includes("Unexpected end of JSON input")) {
        errorMsg = "An unexpected error occurred. Please try again later.";
      }
      setStatus({
        type: "error",
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "/accounts/google/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center overflow-hidden">
      {status.message && (
        <div
          className={`remove-after-seconds fixed top-5 right-5 max-w-xs z-50 flex items-center px-4 py-3 rounded-lg animate-slide-in shadow-lg backdrop-blur-sm 
            ${
              status.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-500"
                : "bg-red-500/10 border border-red-500/20 text-red-500"
            }`}
        >
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  status.type === "success"
                    ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                }
              />
            </svg>
            <span className="text-sm font-medium">{status.message}</span>
          </div>
          <button
            onClick={() => setStatus({ type: null, message: "" })}
            className="ml-4 hover:opacity-75 transition-opacity"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="w-full max-w-md p-8 mt-5 space-y-6 bg-gradient-to-br from-[#28395B] to-[#000000] rounded-2xl transition-all duration-300 mx-4 shadow-[-10px_10px_20px_rgba(0,0,0,0.5),0_-10px_20px_rgba(0,0,0,0.5)] border border-gray-700">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-extrabold text-gray-100">Create Account</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.name ? "border-red-500" : "border-gray-200"
              } rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
            />
            {errors.name && (
              <span className="text-red-400 text-sm mt-1 block">
                {errors.name}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
            />
            {errors.email && (
              <span className="text-red-400 text-sm mt-1 block">
                {errors.email}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-10 border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5 cursor-pointer" />
                ) : (
                  <EyeIcon className="w-5 h-5 cursor-pointer" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-400 text-sm mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-400 text-black font-semibold mb-0 rounded-lg hover:scale-[1.01] hover:bg-gray-300 cursor-pointer shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Register"}
          </button>

          <div className="relative py-4">
            <div className="relative flex justify-center">
              <span className="relative inline-block px-3 text-sm text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full px-4 py-2.5 border cursor-pointer border-gray-200 rounded-lg font-medium flex items-center justify-center gap-2 hover:scale-[1.01] shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
            </svg>
            Sign Up with Google
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="ml-1.5 cursor-pointer font-semibold text-gray-400 hover:text-gray-200 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
