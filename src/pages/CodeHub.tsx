// Import necessary components and hooks
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/codehub/HeroSection';
import CategorySection from '@/components/codehub/CategorySection';
import NotificationPanel from '@/components/codehub/NotificationPanel';
import JoinByCodeDialog from '@/components/codehub/JoinByCodeDialog';
import CreateRoomDialog from '@/components/codehub/CreateRoomDialog';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Define the data outside of the component
export const techTopicsData = [
  { name: 'React', icon: '⚛️', description: 'Build interactive UIs', status: 'active' as const, members: 42 },
  { name: 'JavaScript', icon: '📜', description: 'Programming language', status: 'active' as const, members: 78 },
  { name: 'TypeScript', icon: '🔷', description: 'Typed JavaScript', status: 'active' as const, members: 35 },
  { name: 'Python', icon: '🐍', description: 'General-purpose language', status: 'busy' as const, members: 91 },
  { name: 'Java', icon: '☕', description: 'Enterprise applications', status: 'idle' as const, members: 27 },
  { name: 'C#', icon: '#️⃣', description: '.NET development', status: 'idle' as const, members: 19 },
];

export const databaseData = [
  { name: 'MongoDB', icon: '🍃', description: 'NoSQL database', status: 'active' as const, members: 23 },
  { name: 'PostgreSQL', icon: '🐘', description: 'Advanced SQL', status: 'busy' as const, members: 31 },
  { name: 'MySQL', icon: '🐬', description: 'Popular SQL database', status: 'active' as const, members: 45 },
  { name: 'Redis', icon: '🔴', description: 'In-memory data store', status: 'idle' as const, members: 12 },
];

export const aiData = [
  { name: 'Machine Learning', icon: '🧠', description: 'Algorithms and statistical models', status: 'active' as const, members: 56 },
  { name: 'Neural Networks', icon: '🕸️', description: 'Deep learning', status: 'busy' as const, members: 34 },
  { name: 'Natural Language Processing', icon: '💬', description: 'Text processing', status: 'active' as const, members: 48 },
  { name: 'Computer Vision', icon: '👁️', description: 'Image recognition', status: 'idle' as const, members: 29 },
];

export const notificationsData = [
  { 
    id: '1', 
    type: 'invite' as const, 
    title: 'Room Invitation', 
    message: 'You have been invited to join "Advanced React Patterns" study room',
    time: '10m ago',
    read: false,
    actionable: true
  },
  { 
    id: '2', 
    type: 'activity' as const, 
    title: 'New Resource Added', 
    message: 'A new resource was added to your "TypeScript Basics" room',
    time: '1h ago',
    read: false,
    actionable: false
  },
  { 
    id: '3', 
    type: 'admin' as const, 
    title: 'Join Request', 
    message: 'User alex_dev wants to join your "Python Algorithms" room',
    time: '2h ago',
    read: false,
    actionable: true
  },
  { 
    id: '4', 
    type: 'message' as const, 
    title: 'New Message', 
    message: 'Sarah left a message in "MongoDB Essentials" room',
    time: '1d ago',
    read: true,
    actionable: false
  },
];

// Define the CodeHub component
const CodeHub = () => {
  const { isDarkMode } = useDarkMode();
  const { userProfile } = useUser();
  const [joinByCodeOpen, setJoinByCodeOpen] = useState(false);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for managing notifications
  const [notifications, setNotifications] = useState(notificationsData);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  // Handle notification actions
  const handleMarkRead = (id: string) => {
    setNotifications(prev => 
      prev.map(item => item.id === id ? { ...item, read: true } : item)
    );
  };
  
  const handleAccept = (id: string) => {
    toast({
      title: "Request accepted",
      description: "You've accepted the request",
    });
    handleMarkRead(id);
  };
  
  const handleDecline = (id: string) => {
    toast({
      title: "Request declined",
      description: "You've declined the request",
    });
    setNotifications(prev => prev.filter(item => item.id !== id));
  };
  
  const handleClearAll = () => {
    setNotifications([]);
  };

  // Handle room creation
  const handleCreateRoom = () => {
    setCreateRoomOpen(true);
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
    console.log(`Clicked on ${item.name}`);
    toast({
      title: `Selected ${item.name}`,
      description: `Joining room for ${item.name}`,
    });
    
    const roomId = Math.floor(Math.random() * 10000);
    navigate(`/chat?topic=${encodeURIComponent(item.name)}&roomId=${roomId}`);
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
      {/* Add Navbar */}
      <Navbar />
      
      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header with toggle button */}
        <div className="flex justify-between items-center mb-6 mt-8">
          <h1 className="text-3xl font-bold">CodeHub</h1>
          <div className="flex items-center gap-4">
            {/* Notification bell with popover */}
            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <NotificationPanel
                  notifications={notifications}
                  onMarkRead={handleMarkRead}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onClearAll={handleClearAll}
                />
              </PopoverContent>
            </Popover>
            <ModeToggle />
          </div>
        </div>
        
        {/* Hero section */}
        <HeroSection
          onSearch={handleSearch}
          onCreateRoom={handleCreateRoom}
          onJoinByCode={() => setJoinByCodeOpen(true)}
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
        </div>
      </div>
      
      {/* Dialogs */}
      <JoinByCodeDialog 
        open={joinByCodeOpen} 
        onOpenChange={setJoinByCodeOpen} 
      />
      <CreateRoomDialog
        open={createRoomOpen}
        onOpenChange={setCreateRoomOpen}
      />
    </div>
  );
};

// Default export for the component
export default CodeHub;
