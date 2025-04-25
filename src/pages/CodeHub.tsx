
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, Users, Wrench, Code, Zap, Database, Brain, Search, Hash, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CreateRoomDialog } from '@/components/CreateRoomDialog';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useDarkMode } from '@/contexts/DarkModeContext';
import JoinRoomDialog from '@/components/JoinRoomDialog';

const CodeHub = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [joinRoomDialog, setJoinRoomDialog] = useState<{open: boolean, roomId: number, roomName: string, roomLanguage: string}>({
    open: false,
    roomId: 0,
    roomName: '',
    roomLanguage: ''
  });

  const categories = [
    { name: "Programming", icon: <Code className="w-5 h-5" />, color: "bg-blue-500" },
    { name: "DSA", icon: <Zap className="w-5 h-5" />, color: "bg-purple-500" },
    { name: "Database", icon: <Database className="w-5 h-5" />, color: "bg-green-500" },
    { name: "AI Integration", icon: <Brain className="w-5 h-5" />, color: "bg-orange-500" },
  ];

  const languages = [
    { name: "JavaScript", icon: "js", color: "#f7df1e", users: 423 },
    { name: "Python", icon: "py", color: "#3572A5", users: 389 },
    { name: "TypeScript", icon: "ts", color: "#3178c6", users: 312 },
    { name: "React", icon: "react", color: "#61dafb", users: 287 },
    { name: "Node.js", icon: "node", color: "#339933", users: 245 },
    { name: "Vue", icon: "vue", color: "#4FC08D", users: 198 },
    { name: "Angular", icon: "ng", color: "#DD0031", users: 176 },
    { name: "Go", icon: "go", color: "#00ADD8", users: 154 },
    { name: "Ruby", icon: "rb", color: "#CC342D", users: 132 },
  ];

  const popularRooms = [
    {
      id: 1,
      name: "React Hooks Mastery",
      members: 24,
      language: "React",
      description: "Deep dive into React hooks and custom hook patterns",
      activity: "high"
    },
    {
      id: 2,
      name: "TypeScript Types & Utilities",
      members: 18,
      language: "TypeScript",
      description: "Advanced typing strategies and utility types",
      activity: "medium"
    },
    {
      id: 3,
      name: "Next.js App Router",
      members: 31,
      language: "React",
      description: "Exploring the new Next.js app router and server components",
      activity: "very high"
    },
    {
      id: 4,
      name: "Python Algorithms Study",
      members: 16,
      language: "Python",
      description: "Solving algorithm problems and optimizing solutions",
      activity: "medium"
    },
    {
      id: 5,
      name: "GraphQL API Design",
      members: 22,
      language: "GraphQL",
      description: "Best practices for designing scalable GraphQL schemas",
      activity: "high"
    },
    {
      id: 6,
      name: "Docker & Kubernetes",
      members: 28,
      language: "DevOps",
      description: "Container orchestration and deployment strategies",
      activity: "high"
    }
  ];

  const handleJoinRoom = (roomId: number, roomName: string, roomLanguage: string) => {
    setJoinRoomDialog({
      open: true,
      roomId,
      roomName,
      roomLanguage
    });
  };

  const handleCreateRoom = () => {
    setOpenCreateDialog(true);
  };

  const handleAutoMatch = () => {
    toast({
      title: "Finding matches...",
      description: "We're searching for study rooms that match your interests.",
    });
    
    setTimeout(() => {
      const randomRoom = popularRooms[Math.floor(Math.random() * popularRooms.length)];
      toast({
        title: "Match found!",
        description: `We found "${randomRoom.name}" that matches your interests.`,
      });
      
      setTimeout(() => {
        handleJoinRoom(randomRoom.id, randomRoom.name, randomRoom.language);
      }, 1000);
    }, 2000);
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "very high": return "bg-green-500";
      case "high": return "bg-green-400";
      case "medium": return "bg-yellow-400";
      case "low": return "bg-orange-400";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0a0a0a] text-white' : 'bg-gradient-to-b from-blue-50 to-purple-50'}`}>
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* Hero Section with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h1 className={`text-4xl md:text-5xl font-bold mt-6 mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} relative z-10 animate-fade-in`}>
              CodeHub Study Rooms
            </h1>
            <p className={`text-lg max-w-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} animate-fade-in`} style={{ animationDelay: "0.2s" }}>
              Join study rooms organized by programming language or tech stack. Learn together with real-time chat and AI assistance.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <ModeToggle />
          </div>
        </div>
        
        <div className={`flex flex-wrap justify-between gap-3 mt-8 animate-fade-in ${isDarkMode ? 'bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm' : ''}`} style={{ animationDelay: "0.3s" }}>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={isDarkMode ? "outline" : "outline"}
              className={`hover:bg-purple-100 transition-all duration-300 flex items-center gap-2 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : ''}`}
              onClick={handleCreateRoom}
            >
              <Zap className="w-4 h-4" /> Create Room
            </Button>
            <Button 
              className={`${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90'} text-white transition-all duration-300`}
              onClick={handleAutoMatch}
            >
              <Users className="w-4 h-4 mr-2" /> Auto-Match Me
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search rooms..."
              className={`pl-10 w-full md:w-64 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Categories */}
        <div className="mb-10 mt-10">
          <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'} animate-fade-in`} style={{ animationDelay: "0.4s" }}>
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            {categories.map((category) => (
              <div 
                key={category.name}
                onClick={() => setSelectedCategory(category.name === selectedCategory ? null : category.name)}
                className={`flex flex-col items-center justify-center p-6 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isDarkMode 
                    ? selectedCategory === category.name
                      ? 'bg-gray-700 shadow-lg ring-2 ring-purple-500' 
                      : 'bg-gray-800 hover:bg-gray-700'
                    : selectedCategory === category.name
                      ? 'bg-white shadow-md ring-2 ring-purple-400' 
                      : 'bg-white/70 hover:bg-white'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3 ${category.color}`}>
                  {category.icon}
                </div>
                <span className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>{category.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Language Selection */}
        <div className="mb-10">
          <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'} animate-fade-in`} style={{ animationDelay: "0.6s" }}>
            Browse by Language
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            {languages.map((lang) => (
              <div 
                key={lang.name}
                className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                  isDarkMode 
                    ? selectedLanguage === lang.name
                      ? 'bg-gray-700 shadow-md ring-2 ring-purple-500' 
                      : 'bg-gray-800 hover:bg-gray-700'
                    : selectedLanguage === lang.name
                      ? 'bg-white shadow-md ring-2 ring-purple-400' 
                      : 'bg-white/70 hover:bg-white'
                }`}
                onClick={() => setSelectedLanguage(lang.name === selectedLanguage ? null : lang.name)}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2"
                  style={{ backgroundColor: lang.color }}
                >
                  {lang.icon}
                </div>
                <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : ''}`}>{lang.name}</span>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{lang.users} users</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Popular Rooms */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} animate-fade-in`} style={{ animationDelay: "0.8s" }}>
              Popular Study Rooms
            </h2>
            <Button 
              variant="ghost"
              className={`${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'} animate-fade-in`}
              style={{ animationDelay: "0.8s" }}
              onClick={() => toast({
                title: "More rooms coming soon!",
                description: "We're working on adding more study rooms.",
              })}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.9s" }}>
            {popularRooms.map((room) => (
              <Card key={room.id} className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                isDarkMode ? 'bg-gray-800 border-gray-700 hover:shadow-purple-900/20' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className={`text-xl ${isDarkMode ? 'text-white' : ''}`}>{room.name}</CardTitle>
                      <CardDescription className={`mt-1 ${isDarkMode ? 'text-gray-400' : ''}`}>{room.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`${getActivityColor(room.activity)} w-2 h-2 rounded-full`}></div>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>{room.activity}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Users className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{room.members} members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Hash className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{room.language}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${
                      isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90'
                    } text-white`}
                    onClick={() => handleJoinRoom(room.id, room.name, room.language)}
                  >
                    Join Room
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-16">
          <h2 className={`text-2xl font-semibold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'} animate-fade-in`} style={{ animationDelay: "1s" }}>
            What Makes CodeHub Special
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in" style={{ animationDelay: "1.1s" }}>
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
                <Brain className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : ''}`}>AI Helper</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Get assistance from our AI coding helper to answer questions and provide guidance.</p>
            </div>
            
            <div className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
              <div className={`w-12 h-12 mb-4 rounded-lg ${isDarkMode ? 'bg-orange-900/50' : 'bg-orange-100'} flex items-center justify-center`}>
                <Zap className={`w-6 h-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : ''}`}>Voice Chat</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Optional voice communication for more effective collaboration and discussion.</p>
            </div>
          </div>
        </div>
      </div>

      <CreateRoomDialog open={openCreateDialog} onOpenChange={setOpenCreateDialog} />
      <JoinRoomDialog 
        open={joinRoomDialog.open}
        onOpenChange={(open) => setJoinRoomDialog(prev => ({ ...prev, open }))}
        roomId={joinRoomDialog.roomId}
        roomName={joinRoomDialog.roomName}
        roomLanguage={joinRoomDialog.roomLanguage}
      />
    </div>
  );
};

export default CodeHub;
