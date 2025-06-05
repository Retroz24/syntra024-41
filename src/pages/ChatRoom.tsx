
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useDarkMode } from '@/contexts/DarkModeContext';
import EnhancedRoomSelector from '@/components/chat/EnhancedRoomSelector';
import ChatRoom from '@/components/chat/ChatRoom';
import AuthWrapper from '@/components/chat/AuthWrapper';

interface Room {
  id: string;
  slug: string;
  name: string;
  icon_name: string;
  description: string;
  status: string;
  max_members: number;
  invite_code: string;
  created_at: string;
}

const ChatRoomPage = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleLeaveRoom = () => {
    setSelectedRoom(null);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0a0a0a] text-white' : 'bg-gray-50'}`}>
      <Navbar />
      
      <div className="pt-16">
        <AuthWrapper>
          {(user) => (
            <>
              {!selectedRoom ? (
                <EnhancedRoomSelector onSelectRoom={setSelectedRoom} />
              ) : (
                <ChatRoom room={selectedRoom} onLeave={handleLeaveRoom} />
              )}
            </>
          )}
        </AuthWrapper>
      </div>
    </div>
  );
};

export default ChatRoomPage;
