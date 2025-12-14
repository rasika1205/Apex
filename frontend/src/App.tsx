import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { Toaster } from 'sonner';

// Auth Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Dashboard & Agent Pages
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ProfileAnalysis from './pages/ProfileAnalysis';
import JobSearch from './pages/JobSearch';
import CareerPlanner from './pages/CareerPlanner';
import AutoApply from './pages/AutoApply';
import JobTracker from './pages/JobTracker';
import RejectionAnalyzer from './pages/RejectionAnalyzer';
import News from './pages/News';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export { supabase };

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add dark class to html element
    document.documentElement.classList.add('dark');

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white">Loading APEX...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster theme="dark" position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />} />

        {/* Protected Routes */}
        <Route path="/" element={user ? <DashboardLayout user={user} /> : <Navigate to="/login" />}>
          <Route path="dashboard" element={<Dashboard user={user} />} />
          <Route path="profile-analysis" element={<ProfileAnalysis />} />
          <Route path="job-search" element={<JobSearch />} />
          <Route path="career-planner" element={<CareerPlanner />} />
          <Route path="auto-apply" element={<AutoApply />} />
          <Route path="tracker" element={<JobTracker />} />
          <Route path="analyzer" element={<RejectionAnalyzer />} />
          <Route path="news" element={<News />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;