import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { MessageSquare, Users, Code, BookOpen, Plus, Send, Link } from 'lucide-react';

const roomUsers = [
  { id: 1, name: 'Alex Johnson', status: 'online', avatar: null, isAdmin: true },
  { id: 2, name: 'Sarah Parker', status: 'online', avatar: null, isAdmin: false },
  { id: 3, name: 'Michael Lee', status: 'idle', avatar: null, isAdmin: false },
  { id: 4, name: 'Emily Davis', status: 'offline', avatar: null, isAdmin: false },
];

const initialMessages = [
  { id: 1, userId: 2, text: 'Hey everyone! How\'s it going?', timestamp: '10:30 AM' },
  { id: 2, userId: 1, text: 'Welcome to the room! I just created this for us to discuss React hooks.', timestamp: '10:31 AM' },
  { id: 3, userId: 3, text: 'Great idea! I\'ve been struggling with useEffect dependencies.', timestamp: '10:33 AM' },
  { id: 4, userId: 2, text: 'Yeah, I find the dependency array really tricky sometimes.', timestamp: '10:34 AM' },
  { id: 5, userId: 1, text: 'Let\'s start with a simple example. Here\'s how I structure my useEffect calls:', timestamp: '10:36 AM' },
];

const studyResources = [
  { title: 'React Hooks Documentation', url: 'https://reactjs.org/docs/hooks-intro.html', votes: 12 },
  { title: 'useEffect Complete Guide', url: 'https://overreacted.io/a-complete-guide-to-useeffect/', votes: 10 },
  { title: 'Custom Hooks Patterns', url: 'https://www.example.com/custom-hooks', votes: 8 },
  { title: 'Performance Optimization with useMemo', url: 'https://www.example.com/usememo', votes: 7 },
  { title: 'State Management Alternatives', url: 'https://www.example.com/state-management', votes: 5 },
];

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState(initialMessages);
  const [activeChannel, setActiveChannel] = React.useState('general');
  const [codeSnippet, setCodeSnippet] = React.useState('// Write your code here\nfunction example() {\n  console.log("Hello, world!");\n}\n');
  const [codeLanguage, setCodeLanguage] = React.useState('javascript');
  const [resources, setResources] = React.useState(studyResources);
  const [newResourceUrl, setNewResourceUrl] = React.useState('');
  const [pendingRequests, setPendingRequests] = React.useState([
    { id: 1, name: 'Jessica Williams', message: 'I would like to join this study room to learn about React hooks.' }
  ]);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        userId: 1,
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (newResourceUrl.trim()) {
      try {
        const url = new URL(newResourceUrl);
        const newResource = {
          title: url.hostname.replace('www.', ''),
          url: newResourceUrl,
          votes: 0
        };
        setResources([...resources, newResource]);
        setNewResourceUrl('');
        toast({
          title: "Resource added",
          description: "Your resource has been added to the list",
        });
      } catch (err) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid URL",
          variant: "destructive",
        });
      }
    }
  };

  const handleVoteResource = (index: number) => {
    const newResources = [...resources];
    newResources[index].votes += 1;
    newResources.sort((a, b) => b.votes - a.votes);
    setResources(newResources);
  };

  const handleApproveRequest = (id: number) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== id));
    toast({
      title: "Request approved",
      description: "User has been added to the room",
    });
  };

  const handleDenyRequest = (id: number) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== id));
    toast({
      title: "Request denied",
      description: "User has been notified",
    });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0a0a0a] text-white' : 'bg-gray-50'}`}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)]">
          <div className={`w-full lg:w-64 h-auto lg:h-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow`}>
            <div className="p-4 border-b">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Room #{roomId} - React Hooks
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {roomUsers.length} members
              </p>
            </div>
            
            <div className="p-4">
              <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Members</h4>
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-2">
                  {roomUsers.map(user => (
                    <div 
                      key={user.id}
                      className={`flex items-center p-2 rounded-md ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback className="bg-purple-100 text-purple-800 text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span 
                          className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 ${
                            isDarkMode ? 'border-gray-900' : 'border-white'
                          } ${
                            user.status === 'online' 
                              ? 'bg-green-500' 
                              : user.status === 'idle' 
                              ? 'bg-yellow-500' 
                              : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      
                      <div className="ml-2">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {user.name}
                          </span>
                          {user.isAdmin && (
                            <span className="ml-2 px-1 py-0.5 text-xs bg-purple-100 text-purple-800 rounded">
                              Admin
                            </span>
                          )}
                        </div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            <div className="p-4 border-t">
              <h4 className={`text-sm font-medium mb-2 flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Join Requests</span>
                {pendingRequests.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded">
                    {pendingRequests.length}
                  </span>
                )}
              </h4>
              
              {pendingRequests.length === 0 ? (
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  No pending requests
                </p>
              ) : (
                <div className="space-y-2">
                  {pendingRequests.map(request => (
                    <div 
                      key={request.id}
                      className={`p-2 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {request.name}
                        </span>
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        {request.message}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveRequest(request.id)} 
                          className="h-7 text-xs px-2"
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDenyRequest(request.id)} 
                          className="h-7 text-xs px-2"
                        >
                          Deny
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col h-full">
            <Tabs defaultValue="general" value={activeChannel} onValueChange={setActiveChannel} className="flex flex-col h-full">
              <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-t-lg shadow p-2`}>
                <TabsList className="w-full grid grid-cols-4 h-12">
                  <TabsTrigger value="general" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden md:inline">General</span>
                  </TabsTrigger>
                  <TabsTrigger value="code-help" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span className="hidden md:inline">Code Help</span>
                  </TabsTrigger>
                  <TabsTrigger value="study" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden md:inline">Study Resources</span>
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="hidden md:inline">Upcoming</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="general" className="flex-1 flex flex-col h-full m-0">
                <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-b-lg shadow overflow-hidden`}>
                  <div className="flex flex-col h-full">
                    <ScrollArea className="p-4 h-[calc(100vh-250px)]">
                      <div className="space-y-4">
                        {messages.map(msg => {
                          const user = roomUsers.find(u => u.id === msg.userId);
                          const isCurrentUser = msg.userId === 1;
                          
                          return (
                            <div 
                              key={msg.id}
                              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                                <div className="flex items-end gap-2">
                                  {!isCurrentUser && (
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={user?.avatar || undefined} />
                                      <AvatarFallback className="bg-purple-100 text-purple-800 text-xs">
                                        {user?.name.split(' ').map(n => n[0]).join('') || '?'}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                  
                                  <div 
                                    className={`p-3 rounded-lg ${
                                      isCurrentUser 
                                        ? isDarkMode 
                                          ? 'bg-purple-600 text-white' 
                                          : 'bg-purple-500 text-white' 
                                        : isDarkMode 
                                          ? 'bg-gray-800 text-white' 
                                          : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {!isCurrentUser && (
                                      <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {user?.name}
                                      </div>
                                    )}
                                    <p>{msg.text}</p>
                                  </div>
                                </div>
                                
                                <div 
                                  className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} ${
                                    isCurrentUser ? 'text-right mr-2' : 'ml-10'
                                  }`}
                                >
                                  {msg.timestamp}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    
                    <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message..."
                          className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}
                        />
                        <Button type="submit">
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="code-help" className="flex-1 flex flex-col h-full m-0">
                <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-b-lg shadow overflow-hidden`}>
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          Code Editor
                        </h3>
                        <div className="flex gap-2">
                          <select 
                            value={codeLanguage}
                            onChange={(e) => setCodeLanguage(e.target.value)}
                            className={`text-sm rounded-md px-2 py-1 ${
                              isDarkMode 
                                ? 'bg-gray-800 border-gray-700 text-white' 
                                : 'bg-white border-gray-300'
                            }`}
                          >
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="csharp">C#</option>
                            <option value="cpp">C++</option>
                          </select>
                          
                          <Button variant="outline" size="sm">
                            Run Code
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-0">
                      <textarea 
                        value={codeSnippet}
                        onChange={(e) => setCodeSnippet(e.target.value)}
                        className={`w-full h-[calc(100vh-320px)] p-4 font-mono text-sm resize-none focus:outline-none ${
                          isDarkMode 
                            ? 'bg-gray-800 text-gray-100' 
                            : 'bg-gray-50 text-gray-800'
                        }`}
                        spellCheck="false"
                      />
                    </div>
                    
                    <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                      <div className={`rounded-md p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          Output
                        </h4>
                        <pre className={`mt-2 text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          // Code output will appear here
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="study" className="flex-1 flex flex-col h-full m-0">
                <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-b-lg shadow overflow-hidden`}>
                  <div className="p-4 border-b">
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Study Resources
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Share helpful links and resources with the room
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <form onSubmit={handleAddResource} className="flex gap-2 mb-6">
                      <div className="relative flex-1">
                        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          value={newResourceUrl}
                          onChange={(e) => setNewResourceUrl(e.target.value)}
                          placeholder="Enter resource URL..."
                          className={`pl-10 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}
                        />
                      </div>
                      <Button type="submit">
                        Add Resource
                      </Button>
                    </form>
                    
                    <ScrollArea className="h-[calc(100vh-350px)]">
                      <div className="space-y-3">
                        {resources.map((resource, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} flex items-center`}
                          >
                            <div 
                              className={`mr-3 w-10 h-10 rounded-full flex items-center justify-center ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                              }`}
                            >
                              {resource.votes}
                            </div>
                            
                            <div className="flex-1">
                              <a 
                                href={resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`text-sm font-medium hover:underline ${
                                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                }`}
                              >
                                {resource.title}
                              </a>
                              <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {resource.url}
                              </p>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleVoteResource(index)}
                              className="h-8 px-2"
                            >
                              Vote
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="upcoming" className="flex-1 flex flex-col h-full m-0">
                <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-b-lg shadow overflow-hidden`}>
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center mb-4`}>
                      <Plus className={`h-8 w-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <h3 className={`text-xl font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Coming Soon
                    </h3>
                    <p className={`max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      We're working on adding new features to this channel, including voice chat, screen sharing, and collaborative whiteboards.
                    </p>
                    <Button className="mt-6">Request a Feature</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
