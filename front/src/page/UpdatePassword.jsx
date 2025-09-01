import React, { useState } from "react";
import { useAuth } from "../compo/auth/context";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // NEW state for toggle
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await updatePassword(newPassword);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // NEW function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white relative">
        <div className="max-w-md w-full p-8 text-center bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-800/50 z-10">
          <h2 className="text-3xl font-bold text-green-400">Success!</h2>
          <p className="mt-2 text-gray-400">
            Your password has been updated. Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white relative">
      <div className="max-w-md w-full p-8 space-y-8 bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-800/50 z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Set New Password
        </h2>
        {error && (
          <div className="rounded-lg bg-red-900/30 p-4 border border-red-700">
            <div className="text-sm text-red-400">{error}</div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NEW: Input for New Password with Eye Icon */}
          <div className="relative">
            <label htmlFor="new-password" className="sr-only">
              New Password
            </label>
            <input
              id="new-password"
              name="newPassword"
              type={ "text"  }
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-700/50 placeholder-gray-500 text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
            
            </span>
          </div>

          {/* NEW: Confirm Password input field with Eye Icon */}
          <div className="relative">
            <label htmlFor="confirm-password" className="sr-only">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-700/50 placeholder-gray-500 text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm mt-3"
              placeholder="Confirm Password"
              value={confirmPassword}
              onPaste={(e) => e.preventDefault()}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                {showPassword ? (
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                ) : (
                  <path d="M12 9a3 3 0 100 6 3 3 0 000-6z" />
                )}
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.81 7.822 8.05 4.88 12 4.88s9.19 2.942 10.677 6.567a.75.75 0 010 .106c-1.487 3.625-6.727 6.567-10.677 6.567S2.81 15.172 1.323 11.547a.75.75 0 010-.106zm9.887 2.052a5.5 5.5 0 01-7.11-6.195c.57.198 1.139.46 1.706.78a8.91 8.91 0 003.504 2.45c.87.168 1.76.25 2.651.25.98 0 1.95-.106 2.912-.317A9.458 9.458 0 0021 11.5c.026.046.049.09.071.137a.75.75 0 01-1.066.994 4.5 4.5 0 01-6.193-4.321A5.5 5.5 0 0112 14.25a5.5 5.5 0 01-1.854-.451zM11.5 12a.5.5 0 000 1h.5a.5.5 0 000-1h-.5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? "Updating password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
