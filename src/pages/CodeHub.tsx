
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Wrench, Code, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CodeHub = () => {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

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
    }
  ];

  const handleJoinRoom = (roomId: number) => {
    toast({
      title: "Room Joined!",
      description: "You've successfully joined the room. This is a preview of what the full feature would look like.",
    });
  };

  const handleCreateRoom = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The ability to create rooms will be available in the next update.",
    });
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4 text-gray-900 relative z-10 animate-fade-in">
              CodeHub Study Rooms
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl -z-10"></div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Join study rooms organized by programming language or tech stack. Learn together with real-time chat and AI assistance.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button 
              variant="outline"
              className="hover:bg-purple-100 transition-all duration-300 flex items-center gap-2"
              onClick={handleCreateRoom}
            >
              <Zap className="w-4 h-4" /> Create Room
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white transition-all duration-300"
              onClick={() => toast({
                title: "Finding matches...",
                description: "We're searching for study rooms that match your interests.",
              })}
            >
              <Users className="w-4 h-4 mr-2" /> Auto-Match Me
            </Button>
          </div>
        </div>
        
        {/* Language Selection */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 animate-fade-in" style={{ animationDelay: "0.4s" }}>Browse by Language</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            {languages.map((lang) => (
              <div 
                key={lang.name}
                className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${selectedLanguage === lang.name ? 'bg-white shadow-md ring-2 ring-purple-400' : 'bg-white/70 hover:bg-white'}`}
                onClick={() => setSelectedLanguage(lang.name === selectedLanguage ? null : lang.name)}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2"
                  style={{ backgroundColor: lang.color }}
                >
                  {lang.icon}
                </div>
                <span className="font-medium text-sm">{lang.name}</span>
                <span className="text-xs text-gray-500">{lang.users} users</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Popular Rooms */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 animate-fade-in" style={{ animationDelay: "0.6s" }}>Popular Study Rooms</h2>
            <Button 
              variant="ghost"
              className="text-purple-600 hover:text-purple-800 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
              onClick={() => toast({
                title: "More rooms coming soon!",
                description: "We're working on adding more study rooms.",
              })}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            {popularRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-xl">{room.name}</CardTitle>
                      <CardDescription className="mt-1">{room.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`${getActivityColor(room.activity)} w-2 h-2 rounded-full`}></div>
                      <span className="text-xs text-gray-500 capitalize">{room.activity}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{room.members} members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{room.language}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white"
                    onClick={() => handleJoinRoom(room.id)}
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
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            What Makes CodeHub Special
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in" style={{ animationDelay: "0.9s" }}>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 mb-4 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Interest Matching</h3>
              <p className="text-gray-600">Get automatically matched with developers who share your interests and learning goals.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 mb-4 rounded-lg bg-blue-100 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Chat</h3>
              <p className="text-gray-600">Communicate instantly with room members to solve problems and share ideas.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 mb-4 rounded-lg bg-green-100 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Helper</h3>
              <p className="text-gray-600">Get assistance from our AI coding helper to answer questions and provide guidance.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 mb-4 rounded-lg bg-orange-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Voice Chat</h3>
              <p className="text-gray-600">Optional voice communication for more effective collaboration and discussion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeHub;
