
import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  ChevronLeft, 
  Send, 
  Share2, 
  Plus, 
  Video, 
  AtSign,
  Code,
  PlusCircle,
  Smile
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { ModeToggle } from '@/components/ui/mode-toggle';
import Navbar from '@/components/Navbar';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  avatar: string;
}

const mockUsers = [
  { id: '1', name: 'Alice', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice', status: 'online', role: 'admin' },
  { id: '2', name: 'Bob', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bob', status: 'online', role: 'member' },
  { id: '3', name: 'Charlie', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie', status: 'idle', role: 'member' },
  { id: '4', name: 'Diana', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Diana', status: 'offline', role: 'member' },
  { id: '5', name: 'Ethan', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ethan', status: 'online', role: 'member' },
];

const mockMessages: Message[] = [
  { 
    id: '1', 
    sender: 'Alice', 
    content: 'Hey everyone! Welcome to our new React study room!', 
    timestamp: new Date(Date.now() - 3600000), 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice'
  },
  { 
    id: '2', 
    sender: 'Bob', 
    content: 'Thanks for creating this. I\'ve been struggling with React hooks lately.', 
    timestamp: new Date(Date.now() - 3500000), 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bob'
  },
  { 
    id: '3', 
    sender: 'Charlie', 
    content: 'Has anyone worked with the useContext API? I\'m trying to implement theme switching.', 
    timestamp: new Date(Date.now() - 3400000), 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie'
  },
  { 
    id: '4', 
    sender: 'Diana', 
    content: 'I\'ve used it in a few projects. Here\'s a simple example:\n```jsx\nconst ThemeContext = createContext();\nconst App = () => {\n  const [theme, setTheme] = useState(\'light\');\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      <MainContent />\n    </ThemeContext.Provider>\n  );\n};\n```', 
    timestamp: new Date(Date.now() - 3300000), 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Diana'
  },
];

const ChatRoom = () => {
  const { roomId } = useParams();
  const { toast } = useToast();
  const { isDarkMode } = useDarkMode();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    // Scroll to bottom of messages list
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Generate invite link
    setInviteLink(`${window.location.origin}/room/${roomId}?invite=true`);
  }, [roomId]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: message,
      timestamp: new Date(),
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=You'
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link copied!",
      description: "Invitation link has been copied to clipboard.",
    });
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-[#1A1F2C] text-white' : 'bg-gray-50'}`}>
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className={`w-64 flex-shrink-0 ${isDarkMode ? 'bg-[#1E1F22] border-r border-gray-700' : 'bg-white border-r border-gray-200'}`}>
          <div className={`h-14 px-4 flex items-center justify-between border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <Link 
              to="/codehub"
              className="flex items-center text-sm font-medium hover:opacity-80"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to CodeHub
            </Link>
            <ModeToggle />
          </div>
          
          <div className="p-4">
            <h2 className="text-lg font-semibold flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              React Study Room
            </h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Discussions about React, hooks, and state management
            </p>
          </div>
          
          <div className={`px-4 py-2 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Channels
          </div>
          
          <div className="px-2">
            <Button 
              variant={isDarkMode ? "ghost" : "ghost"} 
              className={`w-full justify-start text-sm mb-1 ${isDarkMode ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <MessageSquare className="w-4 h-4 mr-2" /> general
            </Button>
            <Button 
              variant={isDarkMode ? "ghost" : "ghost"} 
              className={`w-full justify-start text-sm mb-1 ${isDarkMode ? 'hover:bg-gray-800 bg-gray-800 text-gray-200' : 'hover:bg-gray-100 bg-gray-100 text-gray-700'}`}
            >
              <Code className="w-4 h-4 mr-2" /> code-help
            </Button>
            <Button 
              variant={isDarkMode ? "ghost" : "ghost"} 
              className={`w-full justify-start text-sm mb-1 ${isDarkMode ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <Video className="w-4 h-4 mr-2" /> study-sessions
            </Button>
            <Button 
              variant={isDarkMode ? "ghost" : "ghost"} 
              className={`w-full justify-start text-sm ${isDarkMode ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Add Channel
            </Button>
          </div>
          
          <div className={`px-4 py-2 mt-4 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Members ({mockUsers.length})
          </div>
          
          <div className="px-2 pb-4">
            {mockUsers.map(user => (
              <div 
                key={user.id}
                className={`flex items-center px-2 py-1 rounded mb-1 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-7 h-7 rounded-full"
                  />
                  <span 
                    className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'} ${
                      user.status === 'online' ? 'bg-green-500' : 
                      user.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
                <span className="ml-2 text-sm font-medium">{user.name}</span>
                {user.role === 'admin' && (
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                    Admin
                  </span>
                )}
              </div>
            ))}
            
            <Button 
              variant="outline" 
              size="sm"
              className="w-full mt-2"
              onClick={() => setShowShareDialog(!showShareDialog)}
            >
              <Share2 className="w-4 h-4 mr-1" />
              Invite People
            </Button>
            
            {showShareDialog && (
              <div className={`mt-2 p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className="text-xs mb-2">Share this link to invite others:</p>
                <div className="flex">
                  <Input 
                    value={inviteLink}
                    readOnly
                    className="text-xs h-8"
                  />
                  <Button 
                    size="sm" 
                    className="ml-1 h-8"
                    onClick={copyInviteLink}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className={`h-14 px-4 flex items-center justify-between border-b ${isDarkMode ? 'bg-[#1E1F22] border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              <h2 className="font-medium">code-help</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="ghost">
                <Users className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Messages list */}
          <div className={`flex-1 overflow-y-auto p-4 ${isDarkMode ? 'bg-[#1A1F2C]' : 'bg-gray-50'}`}>
            {messages.map((msg) => (
              <div key={msg.id} className="mb-4">
                <div className="flex items-start">
                  <img 
                    src={msg.avatar} 
                    alt={msg.sender}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline">
                      <span className="font-medium">{msg.sender}</span>
                      <span className={`text-xs ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>
                    <div 
                      className={`mt-1 text-sm ${msg.content.includes('```') ? 'whitespace-pre-wrap' : ''}`}
                    >
                      {msg.content.includes('```') ? (
                        <div className={`p-3 rounded-md font-mono text-xs ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          {msg.content.replace(/```jsx|```/g, '')}
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className={`p-4 border-t ${isDarkMode ? 'bg-[#1E1F22] border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center">
              <Button size="icon" variant="ghost" className="rounded-full">
                <Plus className="w-5 h-5" />
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message #code-help"
                className={`mx-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
              />
              <Button size="icon" variant="ghost" className="rounded-full">
                <Smile className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant={message.trim() ? "default" : "ghost"}
                disabled={!message.trim()}
                onClick={handleSendMessage}
                className="rounded-full"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
