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
  const navigate = useNavigate();
  const { register } = useAuth();
  const page = "Signup";

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  // GSAP animation for the card
  useEffect(() => {
    const tl = gsap.timeline();

    // Animate the main card
    tl.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
    );

    // Animate the form inputs with a slight delay
    tl.fromTo(
      [...formRef.current.children],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power2.out" },
      "-=0.5"
    );
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

    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white relative overflow-hidden">
      {/* Background Gradient - Different from Login */}
      <div className="absolute inset-0 z-0 radial-gradient-variant"></div>

      <div 
        ref={containerRef}
        className="max-w-md w-full p-8 space-y-8 bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-800/50 z-10"
      >
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
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-700/50 placeholder-gray-500 text-white bg-gray-800/50 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm mt-3"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
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
              <span className="px-2 bg-gray-950 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <AuthButton page={page} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;