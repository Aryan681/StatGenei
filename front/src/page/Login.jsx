import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../compo/auth/context";
import AuthButton from "../compo/auth/AuthButton";
import { gsap } from "gsap";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const navigate = useNavigate();
  const { supabaseLogin, sendPasswordResetEmail } = useAuth();
  const page = "Login";

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  // This ref is for the card that will flip
  const flipCardRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    if (formRef.current) {
      tl.fromTo(
        formRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power2.out" },
        "-=0.5"
      );
    }
    if (buttonRef.current) {
      tl.fromTo(
        buttonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.3"
      );
    }
  }, []);

  // Use a separate useEffect to handle the flip animation
  useEffect(() => {
    if (isForgotPassword) {
      gsap.to(flipCardRef.current, { rotateY: 180, duration: 0.8 });
    } else {
      gsap.to(flipCardRef.current, { rotateY: 0, duration: 0.8 });
    }
  }, [isForgotPassword]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const result = await supabaseLogin(formData.email, formData.password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");
    setLoading(true);
    if (!resetEmail) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }
    const result = await sendPasswordResetEmail(resetEmail);
    if (result.success) {
      setResetMessage("Check your email for a password reset link!");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white relative overflow-hidden perspective">
      <div className="absolute inset-0 z-0 radial-gradient"></div>

      <div
        ref={containerRef}
        className="max-w-md w-full p-8 space-y-8 relative z-10"
      >
        {/* The main container for the flipping card */}
        <div ref={flipCardRef} className="flip-card-container">
          {/* Front Side: Login Form */}
          <div className="flip-card-front">
            <div>
              <h2 className="mt-6 text-center text-3xl md:text-4xl font-extrabold text-white">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
            </div>
            <form
              ref={formRef}
              className="mt-8 space-y-6"
              onSubmit={handleSubmit}
            >
              {error && (
                <div className="rounded-lg bg-red-900/30 p-4 border border-red-700">
                  <div className="text-sm text-red-400">{error}</div>
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-700/50 placeholder-gray-500 text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-700/50 placeholder-gray-500 text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
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
                <p
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-purple-400 hover:text-purple-300 cursor-pointer mt-2 text-right"
                >
                  Forgot password?
                </p>
              </div>
              <button
                ref={buttonRef} // <-- Add this ref
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <div className="continue-with-separator">
              <span>Or continue with</span>
            </div>
            <div className="mt-6">
              <AuthButton page={page} />
            </div>
          </div>

          {/* Back Side: Forgot Password Form */}
          <div className="flip-card-back">
            <h2 className="text-center text-3xl font-extrabold">
              Reset Password
            </h2>
            {error && (
              <div className="rounded-lg bg-red-900/30 p-4 border border-red-700 mt-4">
                <div className="text-sm text-red-400">{error}</div>
              </div>
            )}
            {resetMessage && (
              <div className="rounded-lg bg-green-900/30 p-4 border border-green-700 mt-4">
                <div className="text-sm text-green-400">{resetMessage}</div>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-700/50 bg-gray-800/50 rounded-lg text-white"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              >
                {loading ? "Sending link..." : "Send Reset Link"}
              </button>
              <p
                onClick={() => setIsForgotPassword(false)}
                className="mt-4 text-sm text-purple-400 hover:text-purple-300 cursor-pointer text-center"
              >
                Back to Login
              </p>
            </form>
            <div className="continue-with-separator">
              <span>Or continue with</span>
            </div>
            <div className="mt-6">
              <AuthButton page={page} />
            </div>
          </div>
        </div>

        {/* This is the "Or continue with" section, now outside the flip card */}
      </div>
    </div>
  );
};

export default Login;
