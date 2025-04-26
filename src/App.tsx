
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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/aiplayground" element={<AiPlayground />} />
        <Route path="/chat" element={<ChatRoom />} />
        <Route path="/codehub" element={<CodeHub />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/avatar" element={<AvatarProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
