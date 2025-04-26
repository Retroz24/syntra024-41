
import { useState } from 'react';
import './App.css';
import Index from './pages/Index';
import AiPlayground from './pages/AiPlayground';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatRoom from './pages/ChatRoom';
import CodeHub from './pages/CodeHub';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AvatarProfile from './pages/AvatarProfile';
import { UserProvider } from './contexts/UserContext';
import { Toaster } from '@/components/ui/toaster';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ai-playground" element={<AiPlayground />} />
          <Route path="/aiplayground" element={<AiPlayground />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/codehub" element={<CodeHub />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/avatar" element={<AvatarProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </UserProvider>
  );
};

export default App;
