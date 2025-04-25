
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import AiPlayground from '@/pages/AiPlayground';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import CodeHub from '@/pages/CodeHub';
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import ChatRoom from '@/pages/ChatRoom';

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ai-playground" element={<AiPlayground />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/codehub" element={<CodeHub />} />
          <Route path="/room/:roomId" element={<ChatRoom />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </DarkModeProvider>
  );
}

export default App;
