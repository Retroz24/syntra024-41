
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useDarkMode } from '@/contexts/DarkModeContext';
import RoomSelector from '@/components/chat/RoomSelector';
import ChatRoom from '@/components/chat/ChatRoom';
import AuthWrapper from '@/components/chat/AuthWrapper';

interface Room {
  id: string;
  slug: string;
  name: string;
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
                <RoomSelector onSelectRoom={setSelectedRoom} />
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
