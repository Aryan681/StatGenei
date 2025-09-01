import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../compo/auth/context';
import AuthButton from '../compo/auth/AuthButton';
import { gsap } from 'gsap';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  // NEW STATE: to toggle password visibility
  const [showPassword, setShowPassword] = useState(false); 
  
  const navigate = useNavigate();
  const { supabaseRegister } = useAuth();
  const page = "Signup";

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
    );
    if (formRef.current) {
      tl.fromTo(
        [...formRef.current.children],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power2.out" },
        "-=0.5"
      );
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await supabaseRegister(formData.name, formData.email, formData.password);
    if (result.success) {
      setIsRegistered(true);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // NEW: Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 radial-gradient-variant"></div>

      <div 
        ref={containerRef}
        className="max-w-md w-full p-8 space-y-8 bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-800/50 z-10"
      >
        {isRegistered ? (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">Registration Successful!</h2>
            <p className="text-gray-400">
              Please check your email for a confirmation link to complete your sign-up. 
              Be sure to check your spam or junk folder.
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 px-6 py-3 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div>
              <h2 className="mt-6 text-center text-3xl md:text-4xl font-extrabold text-white">
                Create your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
            <form ref={formRef} className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-red-900/30 p-4 border border-red-700">
                  <div className="text-sm text-red-400">{error}</div>
                </div>
              )}
              <div className="rounded-lg shadow-sm">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-700/50 placeholder-gray-500 text-white bg-gray-800/50 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
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
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-700/50 placeholder-gray-500 text-white bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm mt-3"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {/* NEW: Password Input with Eye Icon */}
                <div className="relative mt-3">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    // Toggle the input type based on state
                    type={showPassword ? "text" : "password"} 
                    autoComplete="new-password"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-700/50 placeholder-gray-500 text-white bg-gray-800/50 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {/* The SVG Eye Icon */}
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
                      {/* NEW: Conditional rendering for the eye icon */}
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
              </div>

              <div>
                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-950 text-white">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <AuthButton page={page} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;