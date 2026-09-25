import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import TopNav from './components/layout/TopNav';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import BrowseWorkers from './pages/BrowseWorkers';
import BrowseJobs from './pages/BrowseJobs';
import JobDetail from './pages/JobDetail';
import WorkerProfile from './pages/WorkerProfile';
import PostJob from './pages/PostJob';
import Applications from './pages/Applications';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/AuthCallback';

// Protected route component
const ProtectedRoute = ({ children, contractorOnly = false, labourOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (contractorOnly && user.role !== 'contractor') {
    return <Navigate to="/dashboard" replace />;
  }

  if (labourOnly && user.role !== 'labour') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated 3D-style aurora background */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-grid" />
        <div className="aurora-orb aurora-orb--1" />
        <div className="aurora-orb aurora-orb--2" />
        <div className="aurora-orb aurora-orb--3" />
      </div>
      <TopNav />
      <main className="flex-1 pt-16">
        <SocketProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/workers" element={<BrowseWorkers />} />
            <Route path="/jobs" element={<BrowseJobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/workers/:id" element={<WorkerProfile />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/post-job" element={
              <ProtectedRoute contractorOnly><PostJob /></ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute><Applications /></ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute><Messages /></ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute><Notifications /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SocketProvider>
      </main>
      <Footer />
    </div>
  );
}

export default App;
