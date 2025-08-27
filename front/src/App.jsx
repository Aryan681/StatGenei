import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./compo/auth/context";
import Navbar from "./bais/Navbar";
import Footer from "./bais/Footer";
import { useRef, useEffect, useState } from "react";
import Login from "./page/Login";
import Register from "./page/Signup";
import Home from "./page/Home";
import { supabase } from "./compo/auth/supabaseClient";
import Dashboard from "./page/Dashboard";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const homeRef = useRef(null);
  const featuresRef = useRef(null);
  const footerRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      // setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToHome = () => {
    homeRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // if (loading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen">
  //       <Loader size="large" />
  //       <h1 className="text-2xl font-medium text-gray-700 mt-4">Loading...</h1>
  //     </div>
  //   );
  // }

 return (
    <Router>
      <AuthProvider>
        {/* Main container to hold all content vertically */}
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar
            scrollToHome={scrollToHome}
            scrollToFeatures={scrollToFeatures}
            scrollToFooter={scrollToFooter}
            user={user}
          />
          {/* Main content area */}
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/Dashboard" element={<Dashboard/>} />
              <Route
                path="/"
                element={<Home/>}
              />
            </Routes>
          </main>
          {/* Footer at the bottom */}
          <Footer
            scrollToHome={scrollToHome}
            scrollToFeatures={scrollToFeatures}
            scrollToFooter={scrollToFooter}
            footerRef={footerRef}
          />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
