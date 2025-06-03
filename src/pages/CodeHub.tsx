
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import SimpleAuth from '@/components/auth/SimpleAuth';
import { 
  Terminal, 
  Code2, 
  Users, 
  Zap, 
  Coffee, 
  Cpu, 
  Database, 
  Globe, 
  Search,
  Sparkles,
  TrendingUp
} from 'lucide-react';

// Programming languages with icons and stats
const programmingLanguages = [
  { name: 'JavaScript', icon: '📜', color: 'bg-yellow-500', members: 1247, trend: '+12%' },
  { name: 'Python', icon: '🐍', color: 'bg-blue-500', members: 987, trend: '+8%' },
  { name: 'TypeScript', icon: '🔷', color: 'bg-blue-600', members: 756, trend: '+15%' },
  { name: 'React', icon: '⚛️', color: 'bg-cyan-500', members: 823, trend: '+10%' },
  { name: 'Java', icon: '☕', color: 'bg-orange-600', members: 645, trend: '+5%' },
  { name: 'Go', icon: '🐹', color: 'bg-cyan-600', members: 432, trend: '+18%' },
  { name: 'Rust', icon: '🦀', color: 'bg-orange-700', members: 356, trend: '+25%' },
  { name: 'C++', icon: '⚙️', color: 'bg-blue-700', members: 567, trend: '+7%' },
];

const CodeHub = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  const handleRoomClick = (language: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join coding rooms",
        variant: "destructive",
      });
      return;
    }
    
    navigate('/chat');
    toast({
      title: "Joining Room",
      description: `Welcome to the ${language.name} coding room!`,
    });
  };

  const filteredLanguages = programmingLanguages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'}`}>
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-sm font-medium mb-6">
              <Terminal className="w-4 h-4 mr-2" />
              CodeHub - Where Developers Connect
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Code. Chat. Collaborate.
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Join thousands of developers in real-time coding discussions. Share knowledge, debug together, and build the future.
            </p>

            {/* Auth Section */}
            {!user ? (
              <div className="mb-12">
                <SimpleAuth onAuthSuccess={setUser} />
              </div>
            ) : (
              <div className="mb-8">
                <Card className="max-w-md mx-auto bg-green-500/10 border-green-500/30">
                  <CardContent className="pt-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <Zap className="w-5 h-5" />
                      <span className="font-semibold">Connected and Ready!</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search programming languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">5,847</div>
                <div className="text-gray-400">Active Developers</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Code2 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">127</div>
                <div className="text-gray-400">Code Rooms</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">98.7k</div>
                <div className="text-gray-400">Messages Today</div>
              </CardContent>
            </Card>
          </div>

          {/* Programming Language Rooms */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
                Popular Programming Rooms
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLanguages.map((language) => (
                <Card 
                  key={language.name}
                  className="group cursor-pointer bg-gray-800/30 border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/10"
                  onClick={() => handleRoomClick(language)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${language.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                          {language.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white group-hover:text-orange-400 transition-colors">
                            {language.name}
                          </CardTitle>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {language.trend}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{language.members.toLocaleString()} online</span>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white border-0"
                      >
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <Terminal className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Real-time Chat</h3>
              <p className="text-gray-400 text-sm">Instant messaging with syntax highlighting</p>
            </div>
            
            <div className="text-center p-6">
              <Code2 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Code Sharing</h3>
              <p className="text-gray-400 text-sm">Share and review code snippets together</p>
            </div>
            
            <div className="text-center p-6">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Expert Community</h3>
              <p className="text-gray-400 text-sm">Learn from experienced developers</p>
            </div>
            
            <div className="text-center p-6">
              <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400 text-sm">Optimized for speed and performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeHub;
