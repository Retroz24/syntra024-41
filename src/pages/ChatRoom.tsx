
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
  Smile,
  BookOpen
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { ModeToggle } from '@/components/ui/mode-toggle';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger } from '@/components/ui/drawer';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  avatar: string;
}

interface Channel {
  id: string;
  name: string;
  type: "general" | "code-help" | "study-sessions" | "upcoming";
  icon: React.ReactNode;
}

interface CodeSnippet {
  language: string;
  code: string;
}

const mockUsers = [
  { id: '1', name: 'Alice', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice', status: 'online', role: 'admin' },
  { id: '2', name: 'Bob', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bob', status: 'online', role: 'member' },
  { id: '3', name: 'Charlie', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie', status: 'idle', role: 'member' },
  { id: '4', name: 'Diana', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Diana', status: 'offline', role: 'member' },
  { id: '5', name: 'Ethan', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ethan', status: 'online', role: 'member' },
];

const mockGeneralMessages: Message[] = [
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
    content: 'Has anyone used the Mantine UI library? Is it worth learning?', 
    timestamp: new Date(Date.now() - 3400000), 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie'
  },
];

const mockCodeHelpMessages: Message[] = [
  { 
    id: '1', 
    sender: 'Charlie', 
    content: 'Has anyone worked with the useContext API? I\'m trying to implement theme switching.', 
    timestamp: new Date(Date.now() - 3400000), 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie'
  },
  { 
    id: '2', 
    sender: 'Diana', 
    content: 'I\'ve used it in a few projects. Here\'s a simple example:\n```jsx\nconst ThemeContext = createContext();\nconst App = () => {\n  const [theme, setTheme] = useState(\'light\');\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      <MainContent />\n    </ThemeContext.Provider>\n  );\n};\n```', 
    timestamp: new Date(Date.now() - 3300000), 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Diana'
  },
];

const mockStudyMessages: Message[] = [
  {
    id: '1',
    sender: 'Alice',
    content: 'I found this great course on React performance optimization: https://frontendmasters.com/courses/react-performance/',
    timestamp: new Date(Date.now() - 1200000),
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice'
  },
  {
    id: '2',
    sender: 'System',
    content: 'Recommended resources for React study room: \n- React documentation: https://react.dev/ \n- Dan Abramov\'s blog: https://overreacted.io/ \n- Epic React by Kent C. Dodds: https://epicreact.dev/',
    timestamp: new Date(Date.now() - 1000000),
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=System'
  }
];

const upcomingMessages: Message[] = [
  {
    id: '1',
    sender: 'System',
    content: 'This channel will be available soon. Stay tuned for upcoming features!',
    timestamp: new Date(),
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=System'
  }
];

const channels: Channel[] = [
  {
    id: 'general',
    name: 'general',
    type: 'general',
    icon: <MessageSquare className="w-4 h-4" />
  },
  {
    id: 'code-help',
    name: 'code-help',
    type: 'code-help',
    icon: <Code className="w-4 h-4" />
  },
  {
    id: 'study-sessions',
    name: 'study-sessions',
    type: 'study-sessions',
    icon: <BookOpen className="w-4 h-4" />
  },
  {
    id: 'upcoming',
    name: 'upcoming',
    type: 'upcoming',
    icon: <PlusCircle className="w-4 h-4" />
  }
];

const ChatRoom = () => {
  const { roomId } = useParams();
  const { toast } = useToast();
  const { isDarkMode } = useDarkMode();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [codeSnippet, setCodeSnippet] = useState<CodeSnippet | null>(null);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [channelMessages, setChannelMessages] = useState<{
    [key: string]: Message[]
  }>({
    'general': mockGeneralMessages,
    'code-help': mockCodeHelpMessages,
    'study-sessions': mockStudyMessages,
    'upcoming': upcomingMessages
  });

  useEffect(() => {
    // Scroll to bottom of messages list
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChannel, channelMessages]);

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
    
    setChannelMessages({
      ...channelMessages,
      [activeChannel.id]: [...channelMessages[activeChannel.id], newMessage]
    });
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

  const handleCodeSubmit = () => {
    if (!codeSnippet || !codeSnippet.code.trim()) return;
    
    const codeMessage = `\`\`\`${codeSnippet.language}\n${codeSnippet.code}\n\`\`\``;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: codeMessage,
      timestamp: new Date(),
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=You'
    };
    
    setChannelMessages({
      ...channelMessages,
      [activeChannel.id]: [...channelMessages[activeChannel.id], newMessage]
    });
    
    setCodeSnippet(null);
    setIsCodeMode(false);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-[#0a0a0a] text-white' : 'bg-gray-50'}`}>
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className={`w-64 flex-shrink-0 ${isDarkMode ? 'bg-[#111111] border-r border-gray-800' : 'bg-white border-r border-gray-200'}`}>
          <div className={`h-14 px-4 flex items-center justify-between border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
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
            {channels.map(channel => (
              <Button 
                key={channel.id}
                variant={isDarkMode ? "ghost" : "ghost"} 
                className={`w-full justify-start text-sm mb-1 ${
                  activeChannel.id === channel.id
                    ? isDarkMode 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-gray-100 text-gray-900'
                    : isDarkMode
                      ? 'hover:bg-gray-800 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => setActiveChannel(channel)}
              >
                {channel.icon} {channel.name}
              </Button>
            ))}
            <Button 
              variant={isDarkMode ? "ghost" : "ghost"} 
              className={`w-full justify-start text-sm ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
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
          <div className={`h-14 px-4 flex items-center justify-between border-b ${isDarkMode ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center">
              {activeChannel.icon}
              <h2 className="font-medium ml-2">{activeChannel.name}</h2>
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
          <div 
            className={`flex-1 overflow-y-auto p-4 ${
              isDarkMode 
                ? activeChannel.id === 'code-help' 
                  ? 'bg-[#0d1117]' 
                  : 'bg-[#0a0a0a]' 
                : 'bg-gray-50'
            }`}
          >
            {channelMessages[activeChannel.id].map((msg) => (
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
                          {msg.content.replace(/```(jsx|js|ts|typescript|javascript|python|java|c|cpp|csharp|ruby|go|php|html|css|sql)?\n/g, '').replace(/```/g, '')}
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
          {activeChannel.id !== 'upcoming' && (
            <div className={`p-4 border-t ${isDarkMode ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'}`}>
              {activeChannel.id === 'code-help' && (
                <Tabs value={isCodeMode ? "code" : "chat"} className="mb-4">
                  <TabsList>
                    <TabsTrigger value="chat" onClick={() => setIsCodeMode(false)}>
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="code" onClick={() => setIsCodeMode(true)}>
                      Code Editor
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
              
              {isCodeMode && activeChannel.id === 'code-help' ? (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <select 
                      className={`rounded-md flex-1 p-2 text-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
                      value={codeSnippet?.language || ''}
                      onChange={(e) => setCodeSnippet(prev => ({ ...prev || { code: '' }, language: e.target.value }))}
                    >
                      <option value="">Select language</option>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="jsx">React/JSX</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="c">C</option>
                      <option value="cpp">C++</option>
                      <option value="csharp">C#</option>
                      <option value="go">Go</option>
                      <option value="php">PHP</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="sql">SQL</option>
                    </select>
                    <Button onClick={handleCodeSubmit}>Submit Code</Button>
                  </div>
                  <textarea 
                    placeholder="Paste or write your code here..." 
                    rows={10}
                    className={`w-full p-3 font-mono text-sm rounded-md ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-gray-100'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    value={codeSnippet?.code || ''}
                    onChange={(e) => setCodeSnippet(prev => ({ ...prev || { language: '' }, code: e.target.value }))}
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <Plus className="w-5 h-5" />
                  </Button>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message #${activeChannel.name}`}
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
              )}
            </div>
          )}
          
          {activeChannel.id === 'upcoming' && (
            <div className={`p-6 flex-1 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-center space-y-3">
                <PlusCircle className="w-16 h-16 mx-auto opacity-30" />
                <h3 className="text-xl font-medium">Coming Soon</h3>
                <p>This feature is currently in development and will be available soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
