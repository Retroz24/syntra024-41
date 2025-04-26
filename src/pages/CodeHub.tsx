
// Import necessary components and hooks
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/codehub/HeroSection';
import CategorySection from '@/components/codehub/CategorySection';
import NotificationPanel from '@/components/codehub/NotificationPanel';
import JoinByCodeDialog from '@/components/codehub/JoinByCodeDialog';
import CreateRoomDialog from '@/components/codehub/CreateRoomDialog';
import MiniProfile from '@/components/codehub/MiniProfile';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Define expanded data outside of the component
export const techTopicsData = [
  { name: 'React', icon: '⚛️', description: 'Build interactive UIs', status: 'active' as const, members: 0 },
  { name: 'JavaScript', icon: '📜', description: 'Programming language', status: 'active' as const, members: 0 },
  { name: 'TypeScript', icon: '🔷', description: 'Typed JavaScript', status: 'active' as const, members: 0 },
  { name: 'Python', icon: '🐍', description: 'General-purpose language', status: 'busy' as const, members: 0 },
  { name: 'Java', icon: '☕', description: 'Enterprise applications', status: 'idle' as const, members: 0 },
  { name: 'C#', icon: '#️⃣', description: '.NET development', status: 'idle' as const, members: 0 },
  { name: 'HTML/CSS', icon: '🌐', description: 'Web fundamentals', status: 'active' as const, members: 0 },
  { name: 'Ruby', icon: '💎', description: 'Dynamic language', status: 'idle' as const, members: 0 },
  { name: 'Swift', icon: '🐦', description: 'iOS & macOS development', status: 'active' as const, members: 0 },
  { name: 'PHP', icon: '🐘', description: 'Web development', status: 'idle' as const, members: 0 },
  { name: 'Go', icon: '🐹', description: 'Concurrent programming', status: 'active' as const, members: 0 },
  { name: 'Rust', icon: '🦀', description: 'Systems programming', status: 'busy' as const, members: 0 },
];

export const databaseData = [
  { name: 'MongoDB', icon: '🍃', description: 'NoSQL database', status: 'active' as const, members: 0 },
  { name: 'PostgreSQL', icon: '🐘', description: 'Advanced SQL', status: 'busy' as const, members: 0 },
  { name: 'MySQL', icon: '🐬', description: 'Popular SQL database', status: 'active' as const, members: 0 },
  { name: 'Redis', icon: '🔴', description: 'In-memory data store', status: 'idle' as const, members: 0 },
  { name: 'Cassandra', icon: '👁️', description: 'Distributed NoSQL', status: 'idle' as const, members: 0 },
  { name: 'SQLite', icon: '🗄️', description: 'Embedded database', status: 'active' as const, members: 0 },
  { name: 'Firebase', icon: '🔥', description: 'Backend-as-a-service', status: 'busy' as const, members: 0 },
  { name: 'DynamoDB', icon: '⚡', description: 'AWS NoSQL database', status: 'idle' as const, members: 0 },
];

export const aiData = [
  { name: 'Machine Learning', icon: '🧠', description: 'Algorithms and statistical models', status: 'active' as const, members: 0 },
  { name: 'Neural Networks', icon: '🕸️', description: 'Deep learning', status: 'busy' as const, members: 0 },
  { name: 'Natural Language Processing', icon: '💬', description: 'Text processing', status: 'active' as const, members: 0 },
  { name: 'Computer Vision', icon: '👁️', description: 'Image recognition', status: 'idle' as const, members: 0 },
  { name: 'Reinforcement Learning', icon: '🎮', description: 'Learning from environment', status: 'active' as const, members: 0 },
  { name: 'Generative AI', icon: '🎨', description: 'Content generation', status: 'busy' as const, members: 0 },
];

export const dsaData = [
  { name: 'Data Structures', icon: '🏗️', description: 'Organize and store data', status: 'active' as const, members: 0 },
  { name: 'Algorithms', icon: '⚙️', description: 'Problem solving methods', status: 'active' as const, members: 0 },
  { name: 'Graph Theory', icon: '🔗', description: 'Study of graphs', status: 'idle' as const, members: 0 },
  { name: 'Dynamic Programming', icon: '📊', description: 'Optimization technique', status: 'busy' as const, members: 0 },
  { name: 'Big O Notation', icon: '📈', description: 'Algorithm efficiency', status: 'active' as const, members: 0 },
  { name: 'Sorting Algorithms', icon: '🔄', description: 'Element ordering', status: 'idle' as const, members: 0 },
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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  // Handle notification actions
  const handleMarkRead = (id: string) => {
    setNotifications(prev => 
      prev.map(item => item.id === id ? { ...item, read: true } : item)
    );
  };
  
  const handleAccept = (id: string) => {
    // Find the notification
    const notification = notifications.find(n => n.id === id);
    if (notification && notification.roomId) {
      toast({
        title: "Request accepted",
        description: `You've accepted the request and joined ${notification.roomName || 'the room'}`,
      });
      
      // Navigate to the room
      navigate(`/chat?roomId=${notification.roomId}`);
    } else {
      toast({
        title: "Request accepted",
        description: "You've accepted the request",
      });
    }
    
    // Remove the notification
    setNotifications(prev => prev.filter(item => item.id !== id));
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
    const topics = [...techTopicsData, ...databaseData, ...aiData, ...dsaData];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    toast({
      title: "Random matching",
      description: `You've been matched with ${randomTopic.name}`,
    });
    
    setTimeout(() => {
      const randomRoomId = Math.floor(Math.random() * 10000);
      navigate(`/chat?topic=${encodeURIComponent(randomTopic.name)}&roomId=${randomRoomId}`);
    }, 1000);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle clicking on a category item
  const handleItemClick = (item: { name: string }) => {
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
  
  const filteredDsaTopics = dsaData.filter(item => 
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
            
            <CategorySection
              title="Data Structures & Algorithms"
              items={filteredDsaTopics}
              onItemClick={handleItemClick}
            />
          </div>
          
          {/* Sidebar content */}
          <div className="space-y-6">
            <MiniProfile username={userProfile.username !== 'guest' ? userProfile.username : undefined} />
            
            {/* Recent rooms could go here */}
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
