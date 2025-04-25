
// Import necessary components and hooks
import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/codehub/HeroSection';
import CategorySection from '@/components/codehub/CategorySection';
import NotificationPanel from '@/components/codehub/NotificationPanel';
import JoinByCodeDialog from '@/components/codehub/JoinByCodeDialog';
import { useNavigate } from 'react-router-dom';
import { techTopicsData, databaseData, aiData, notificationsData } from '@/pages/CodeHub';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useUser } from '@/contexts/UserContext';

// Define the CodeHub component
const CodeHub = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { userProfile } = useUser();
  const [joinByCodeOpen, setJoinByCodeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // State for managing notifications
  const [notifications, setNotifications] = useState(notificationsData);
  
  // Handle notification actions
  const handleMarkRead = (id: string) => {
    setNotifications(prev => 
      prev.map(item => item.id === id ? { ...item, read: true } : item)
    );
  };
  
  const handleAccept = (id: string) => {
    // Handle accepting requests (e.g., room invite, join request)
    toast({
      title: "Request accepted",
      description: "You've accepted the request",
    });
    handleMarkRead(id);
  };
  
  const handleDecline = (id: string) => {
    // Handle declining requests
    toast({
      title: "Request declined",
      description: "You've declined the request",
    });
    // Remove the notification
    setNotifications(prev => prev.filter(item => item.id !== id));
  };
  
  const handleClearAll = () => {
    setNotifications([]);
  };

  // Handle room creation
  const handleCreateRoom = () => {
    // This would open a create room dialog in a real implementation
    navigate(`/room/${Math.floor(Math.random() * 10000)}`);
  };

  // Handle joining by code
  const handleJoinByCode = () => {
    setJoinByCodeOpen(true);
  };

  // Handle random matching
  const handleRandomMatch = () => {
    const randomRoomId = Math.floor(Math.random() * 10000);
    navigate(`/room/${randomRoomId}`);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  // Handle clicking on a category item
  const handleItemClick = (item: { name: string }) => {
    const roomId = Math.floor(Math.random() * 10000);
    navigate(`/room/${roomId}?topic=${encodeURIComponent(item.name)}`);
  };

  // Filtered topics based on search query
  const filteredTechTopics = techTopicsData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredDatabaseTopics = databaseData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredAiTopics = aiData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with toggle button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">CodeHub</h1>
          <button 
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 border border-gray-200'}`}
          >
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
        
        {/* Hero section */}
        <HeroSection
          onSearch={handleSearch}
          onCreateRoom={handleCreateRoom}
          onJoinByCode={handleJoinByCode}
          onRandomMatch={handleRandomMatch}
        />
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2">
            {/* Category sections */}
            <CategorySection
              title="Programming & Tech"
              items={filteredTechTopics}
              onItemClick={handleItemClick}
            />
            
            <CategorySection
              title="Databases & Storage"
              items={filteredDatabaseTopics}
              onItemClick={handleItemClick}
            />
            
            <CategorySection
              title="AI & Machine Learning"
              items={filteredAiTopics}
              onItemClick={handleItemClick}
            />
          </div>
          
          {/* Side panel */}
          <div className="space-y-6">
            {/* User profile summary component would go here */}
            
            {/* Notifications */}
            <NotificationPanel 
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </div>
      
      {/* Dialogs */}
      <JoinByCodeDialog 
        open={joinByCodeOpen} 
        onOpenChange={setJoinByCodeOpen} 
      />
    </div>
  );
};

// Missing import for toast - let's add it
import { useToast } from '@/components/ui/use-toast';

// Export the data for reuse
export { techTopicsData, databaseData, aiData, notificationsData };

// Default export for the component
export default CodeHub;
