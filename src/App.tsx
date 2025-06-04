
import { useState } from 'react';
import './App.css';
import Index from './pages/Index';
import AiPlayground from './pages/AiPlayground';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatRoom from './pages/ChatRoom';
import CodeHub from './pages/CodeHub';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AvatarProfile from './pages/AvatarProfile';
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from './contexts/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/ai-playground" element={<AiPlayground />} />
      <Route path="/aiplayground" element={<AiPlayground />} />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <ChatRoom />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/codehub" 
        element={
          <ProtectedRoute>
            <CodeHub />
          </ProtectedRoute>
        } 
      />
      <Route path="/profile" element={<Profile />} />
      <Route path="/avatar" element={<AvatarProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;
