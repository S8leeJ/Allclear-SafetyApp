import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Friends from './pages/Friends';
import Testing from './pages/Testing';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-roboto relative min-h-screen bg-gradient-to-b from-black via-blue-1000 to-blue-700 text-white overflow-hidden">
          <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="ml-64 relative min-h-screen">
                    <div className="max-w-5xl mx-auto px-8 py-12 z-10">
                      <Home />
                    </div>
                  </div>
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/friends" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="ml-64 relative min-h-screen">
                    <div className="max-w-5xl mx-auto px-8 py-12 z-10">
                      <Friends />
                    </div>
                  </div>
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/testing" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="ml-64 relative min-h-screen">
                    <div className="max-w-5xl mx-auto px-8 py-12 z-10">
                      <Testing />
                    </div>
                  </div>
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="ml-64 relative min-h-screen">
                    <div className="max-w-5xl mx-auto px-8 py-12 z-10">
                      <Settings />
                    </div>
                  </div>
                </>
              </ProtectedRoute>
            } />
            
            {/* Redirect to home for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
