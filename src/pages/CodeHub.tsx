
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/ui/use-toast';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateRoomDialog } from '@/components/CreateRoomDialog';

// Import our new components
import HeroSection from '@/components/codehub/HeroSection';
import CategorySection from '@/components/codehub/CategorySection';
import JoinRoomModal from '@/components/codehub/JoinRoomModal';
import NotificationPanel from '@/components/codehub/NotificationPanel';
import MiniProfile from '@/components/codehub/MiniProfile';
import JoinByCodeDialog from '@/components/codehub/JoinByCodeDialog';

// Mock data for programming languages
const languagesData = [
  { name: "JavaScript", icon: "JS", status: "active" as const, members: 423, description: "Modern JS & frameworks" },
  { name: "Python", icon: "Py", status: "active" as const, members: 389, description: "Python ecosystem" },
  { name: "TypeScript", icon: "TS", status: "busy" as const, members: 312, description: "Type-safe JS development" },
  { name: "React", icon: "Re", status: "active" as const, members: 287, description: "React & React Native" },
  { name: "Node.js", icon: "No", status: "active" as const, members: 245, description: "Server-side JavaScript" },
  { name: "Vue", icon: "Vu", status: "idle" as const, members: 198, description: "Vue.js ecosystem" },
  { name: "Angular", icon: "Ng", status: "busy" as const, members: 176, description: "Angular development" },
  { name: "Go", icon: "Go", status: "idle" as const, members: 154, description: "Golang programming" },
  { name: "Ruby", icon: "Rb", status: "idle" as const, members: 132, description: "Ruby and Rails" },
  { name: "Java", icon: "Ja", status: "active" as const, members: 221, description: "Java development" },
];

// Mock data for general tech topics
const techTopicsData = [
  { name: "Git & GitHub", icon: "Gt", status: "active" as const, members: 187, description: "Version control & collaboration" },
  { name: "CI/CD", icon: "CI", status: "idle" as const, members: 124, description: "Continuous integration & delivery" },
  { name: "Docker", icon: "Do", status: "active" as const, members: 156, description: "Containerization" },
  { name: "Kubernetes", icon: "K8", status: "busy" as const, members: 98, description: "Container orchestration" },
  { name: "Cloud", icon: "Cl", status: "active" as const, members: 211, description: "AWS, Azure, GCP" },
  { name: "DevOps", icon: "Dv", status: "active" as const, members: 164, description: "Development operations" },
];

// Mock data for database topics
const databaseData = [
  { name: "MongoDB", icon: "Mo", status: "active" as const, members: 187, description: "NoSQL database" },
  { name: "PostgreSQL", icon: "Pg", status: "busy" as const, members: 173, description: "SQL database" },
  { name: "MySQL", icon: "My", status: "active" as const, members: 159, description: "SQL database" },
  { name: "Redis", icon: "Re", status: "idle" as const, members: 112, description: "In-memory data store" },
  { name: "Firebase", icon: "Fb", status: "active" as const, members: 142, description: "Backend-as-a-service" },
];

// Mock data for AI integration
const aiData = [
  { name: "LangChain", icon: "Lc", status: "active" as const, members: 124, description: "LLM framework" },
  { name: "OpenAI", icon: "OA", status: "busy" as const, members: 194, description: "AI APIs & services" },
  { name: "TensorFlow", icon: "Tf", status: "idle" as const, members: 107, description: "ML framework" },
  { name: "PyTorch", icon: "Pt", status: "active" as const, members: 118, description: "ML framework" },
  { name: "Hugging Face", icon: "HF", status: "busy" as const, members: 89, description: "ML models & tools" },
];

// Mock data for notifications
const notificationsData = [
  {
    id: "1",
    type: "invite",
    title: "Room Invitation",
    message: "Alex invited you to join 'React Hooks Mastery'",
    time: "5m ago",
    read: false,
    actionable: true
  },
  {
    id: "2",
    type: "activity",
    title: "Room Activity",
    message: "New message in 'TypeScript Types & Utilities'",
    time: "15m ago",
    read: false,
    actionable: false
  },
  {
    id: "3",
    type: "admin",
    title: "Join Request",
    message: "Sarah wants to join your 'Python Algorithms' room",
    time: "30m ago",
    read: false,
    actionable: true
  },
  {
    id: "4",
    type: "message",
    title: "New Message",
    message: "Mike: Can anyone help with a React Router issue?",
    time: "1h ago",
    read: true,
    actionable: false
  }
];

// Mock data for joined rooms
const joinedRoomsData = [
  {
    id: 1,
    name: "React Hooks Mastery",
    type: "React",
    isAdmin: true
  },
  {
    id: 2,
    name: "TypeScript Advanced",
    type: "TypeScript",
    isAdmin: false
  }
];

const CodeHub = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openJoinByCodeDialog, setOpenJoinByCodeDialog] = React.useState(false);
  const [joinRoomModal, setJoinRoomModal] = React.useState<{
    isOpen: boolean;
    roomName: string;
    roomType: string;
  }>({
    isOpen: false,
    roomName: '',
    roomType: ''
  });
  
  // State for notifications and sidebar toggles
  const [notifications, setNotifications] = React.useState(notificationsData);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  
  // Current category tab
  const [currentCategory, setCurrentCategory] = React.useState('languages');
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    toast({
      title: "Searching...",
      description: `Finding results for "${query}"`,
    });
  };

  const handleCreateRoom = () => {
    setOpenCreateDialog(true);
  };
  
  const handleJoinByCode = () => {
    setOpenJoinByCodeDialog(true);
  };
  
  const handleRandomMatch = () => {
    toast({
      title: "Finding matches...",
      description: "Searching for study rooms that match your interests.",
    });
    
    // Simulate finding a match
    setTimeout(() => {
      const categories = [languagesData, techTopicsData, databaseData, aiData];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomRoom = randomCategory[Math.floor(Math.random() * randomCategory.length)];
      
      toast({
        title: "Match found!",
        description: `We found "${randomRoom.name}" that matches your interests.`,
      });
      
      setTimeout(() => {
        handleRoomClick(randomRoom);
      }, 1000);
    }, 2000);
  };

  const handleRoomClick = (item: any) => {
    setJoinRoomModal({
      isOpen: true,
      roomName: item.name,
      roomType: currentCategory === 'languages' 
        ? 'programming' 
        : currentCategory === 'tech' 
          ? 'technology' 
          : currentCategory === 'databases' 
            ? 'database' 
            : 'AI'
    });
  };
  
  const handleJoinRoom = (asGuest: boolean, username?: string) => {
    const roomId = Math.floor(Math.random() * 10000);
    setJoinRoomModal(prev => ({ ...prev, isOpen: false }));
    
    // Add small delay before navigating
    setTimeout(() => {
      navigate(`/room/${roomId}`);
    }, 500);
  };
  
  const handleCreateCustomRoom = (name: string) => {
    const roomId = Math.floor(Math.random() * 10000);
    setJoinRoomModal(prev => ({ ...prev, isOpen: false }));
    
    // Add small delay before navigating
    setTimeout(() => {
      navigate(`/room/${roomId}`);
    }, 500);
  };
  
  // Notification handlers
  const handleMarkRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const handleAccept = (id: string) => {
    toast({
      title: "Request accepted",
      description: "User has been added to the room",
    });
    
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const handleDecline = (id: string) => {
    toast({
      title: "Request declined",
      description: "User has been notified",
    });
    
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const handleClearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been removed",
    });
  };
  
  // Profile handlers
  const handleLeaveRoom = (roomId: number) => {
    toast({
      title: "Left room",
      description: "You have successfully left the room",
    });
    // Update joined rooms in a real app
  };
  
  const handleTransferOwnership = (roomId: number) => {
    toast({
      title: "Transfer initiated",
      description: "Please select a user to transfer ownership to",
    });
    // Show transfer dialog in a real app
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0a0a0a] text-white' : 'bg-gradient-to-b from-blue-50 to-purple-50'}`}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Main Content Area with sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Mini Profile (shown/hidden based on state) */}
          {showProfile && (
            <div className="w-full lg:w-72 order-3 lg:order-1">
              <MiniProfile
                username="DevUser"
                status="online"
                role="Admin"
                joinedRooms={joinedRoomsData}
                onViewProfile={() => navigate('/profile')}
                onLeaveRoom={handleLeaveRoom}
                onTransferOwnership={handleTransferOwnership}
              />
            </div>
          )}
          
          {/* Main Content */}
          <div className="flex-1 order-1 lg:order-2">
            {/* Hero Section */}
            <HeroSection
              onSearch={handleSearch}
              onCreateRoom={handleCreateRoom}
              onJoinByCode={handleJoinByCode}
              onRandomMatch={handleRandomMatch}
            />
            
            {/* Categorized Sections */}
            <div className="mt-10">
              <Tabs 
                defaultValue="languages" 
                value={currentCategory}
                onValueChange={setCurrentCategory}
                className="w-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Browse Categories
                  </h2>
                  <TabsList className={`grid grid-cols-4 w-auto ${isDarkMode ? 'bg-gray-800' : ''}`}>
                    <TabsTrigger value="languages">Languages</TabsTrigger>
                    <TabsTrigger value="tech">Tech Topics</TabsTrigger>
                    <TabsTrigger value="databases">Databases</TabsTrigger>
                    <TabsTrigger value="ai">AI Integration</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="languages" className="mt-0 animate-fade-in">
                  <CategorySection 
                    title="Programming Languages & Frameworks" 
                    items={languagesData}
                    onItemClick={handleRoomClick}
                  />
                </TabsContent>
                
                <TabsContent value="tech" className="mt-0 animate-fade-in">
                  <CategorySection 
                    title="General Tech Topics" 
                    items={techTopicsData}
                    onItemClick={handleRoomClick}
                  />
                </TabsContent>
                
                <TabsContent value="databases" className="mt-0 animate-fade-in">
                  <CategorySection 
                    title="Database Technologies" 
                    items={databaseData}
                    onItemClick={handleRoomClick}
                  />
                </TabsContent>
                
                <TabsContent value="ai" className="mt-0 animate-fade-in">
                  <CategorySection 
                    title="AI & ML Integration" 
                    items={aiData}
                    onItemClick={handleRoomClick}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Features Section - Simplified from the original */}
            <div className="mt-16 mb-10">
              <h2 className={`text-2xl font-semibold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                What Makes CodeHub Special
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
                  <div className={`w-12 h-12 mb-4 rounded-lg ${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'} flex items-center justify-center`}>
                    <Users className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : ''}`}>Interest Matching</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Get automatically matched with developers who share your interests and learning goals.</p>
                </div>
                
                <div className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
                  <div className={`w-12 h-12 mb-4 rounded-lg ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'} flex items-center justify-center`}>
                    <MessageSquare className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : ''}`}>Real-time Chat</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Communicate instantly with room members to solve problems and share ideas.</p>
                </div>
                
                <div className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
                  <div className={`w-12 h-12 mb-4 rounded-lg ${isDarkMode ? 'bg-green-900/50' : 'bg-green-100'} flex items-center justify-center`}>
                    <Code className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : ''}`}>Collaborative Coding</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Share and review code in real-time with built-in multi-language code editor.</p>
                </div>
                
                <div className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
                  <div className={`w-12 h-12 mb-4 rounded-lg ${isDarkMode ? 'bg-orange-900/50' : 'bg-orange-100'} flex items-center justify-center`}>
                    <Check className={`w-6 h-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : ''}`}>Admin Controls</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Manage room access, approve join requests, and moderate discussions with ease.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Notifications (shown/hidden based on state) */}
          {showNotifications && (
            <div className="w-full lg:w-72 order-2 lg:order-3">
              <NotificationPanel 
                notifications={notifications}
                onMarkRead={handleMarkRead}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onClearAll={handleClearAllNotifications}
              />
            </div>
          )}
        </div>
        
        {/* Floating action buttons for mobile */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              isDarkMode 
                ? showProfile ? 'bg-purple-600' : 'bg-gray-800' 
                : showProfile ? 'bg-purple-600' : 'bg-white'
            }`}
          >
            <User className={`w-5 h-5 ${showProfile ? 'text-white' : isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} />
          </button>
          
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              isDarkMode 
                ? showNotifications ? 'bg-purple-600' : 'bg-gray-800' 
                : showNotifications ? 'bg-purple-600' : 'bg-white'
            } relative`}
          >
            <Bell className={`w-5 h-5 ${showNotifications ? 'text-white' : isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Dialogs */}
      <CreateRoomDialog open={openCreateDialog} onOpenChange={setOpenCreateDialog} />
      <JoinByCodeDialog open={openJoinByCodeDialog} onOpenChange={setOpenJoinByCodeDialog} />
      <JoinRoomModal 
        isOpen={joinRoomModal.isOpen}
        onClose={() => setJoinRoomModal(prev => ({ ...prev, isOpen: false }))}
        roomName={joinRoomModal.roomName}
        roomType={joinRoomModal.roomType}
        onJoin={handleJoinRoom}
        onCreateCustom={handleCreateCustomRoom}
      />
    </div>
  );
};

export default CodeHub;
