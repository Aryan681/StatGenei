import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { AuthProvider, useAuth } from "./compo/auth/context";
import Navbar from "./bais/Navbar";
import { useRef, useEffect, useState } from "react";
import Login from "./page/Login";
import Register from "./page/Signup";
import Home from "./page/Home";
import { supabase } from "./compo/auth/supabaseClient";
import Dashboard from "./page/Dashboard";
import UpdatePassword from "./page/UpdatePassword";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const homeRef = useRef(null);
  const featuresRef = useRef(null);
  const footerRef = useRef(null);

  const showNavbar = location.pathname !== "/Dashboard";

  return (
    <>
      {showNavbar && (
        <Navbar
          homeRef={homeRef}     
          featuresRef={featuresRef} 
          footerRef={footerRef}   
          user={user}
        />
      )}
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/updatepassword" element={<UpdatePassword />} />
          <Route
            path="/"
            element={
              <Home
                homeRef={homeRef}
                featuresRef={featuresRef}
                footerRef={footerRef}
              />
            }
          />
        </Routes>
      </main>
    </>
  );
};

const AppRoutes = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;