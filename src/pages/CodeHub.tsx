
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/codehub/HeroSection';
import CategorySection from '@/components/codehub/CategorySection';
import NotificationPanel from '@/components/codehub/NotificationPanel';
import JoinByCodeDialog from '@/components/codehub/JoinByCodeDialog';
import CreateRoomDialog from '@/components/codehub/CreateRoomDialog';
import MiniProfile from '@/components/codehub/MiniProfile';
import UserRoomsPanel from '@/components/codehub/UserRoomsPanel';
import AuthWrapper from '@/components/chat/AuthWrapper';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { createRoom, joinRoom } from '@/utils/roomUtils';

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

export const webDevData = [
  { name: 'HTML', icon: '🌐', description: 'Web markup language', status: 'active' as const, members: 0 },
  { name: 'CSS', icon: '🎨', description: 'Styling language', status: 'active' as const, members: 0 },
  { name: 'JavaScript', icon: '📜', description: 'Web programming', status: 'active' as const, members: 0 },
  { name: 'React', icon: '⚛️', description: 'UI library', status: 'active' as const, members: 0 },
  { name: 'Vue', icon: '💚', description: 'Progressive framework', status: 'active' as const, members: 0 },
  { name: 'Angular', icon: '🅰️', description: 'Full framework', status: 'active' as const, members: 0 },
  { name: 'Node.js', icon: '💚', description: 'Runtime environment', status: 'active' as const, members: 0 },
  { name: 'Express', icon: '🚂', description: 'Web framework', status: 'active' as const, members: 0 }
];

export const devopsData = [
  { name: 'Docker', icon: '🐳', description: 'Containerization', status: 'active' as const, members: 0 },
  { name: 'Kubernetes', icon: '⚙️', description: 'Container orchestration', status: 'active' as const, members: 0 },
  { name: 'Jenkins', icon: '🤖', description: 'CI/CD', status: 'active' as const, members: 0 },
  { name: 'AWS', icon: '☁️', description: 'Cloud platform', status: 'active' as const, members: 0 },
  { name: 'Git', icon: '📚', description: 'Version control', status: 'active' as const, members: 0 }
];

const CodeHub = () => {
  const { userProfile } = useUser();
  const [joinByCodeOpen, setJoinByCodeOpen] = useState(false);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [memberCounts, setMemberCounts] = useState<{ [key: string]: number }>({});
  const [userMemberships, setUserMemberships] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    fetchMemberCounts();
    fetchUserMemberships();
    
    const membershipChannel = supabase
      .channel('membership-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'memberships'
        },
        () => {
          fetchMemberCounts();
          fetchUserMemberships();
        }
      )
      .subscribe();

    const roomChannel = supabase
      .channel('room-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms'
        },
        () => {
          fetchMemberCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(membershipChannel);
      supabase.removeChannel(roomChannel);
    };
  }, []);

  const fetchUserMemberships = async () => {
    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser.user) return;

      const { data: memberships, error } = await supabase
        .from('memberships')
        .select('room_id, rooms(name)')
        .eq('user_id', authUser.user.id);

      if (error) throw error;

      const roomNames = new Set(
        (memberships || [])
          .map(m => m.rooms?.name?.toLowerCase())
          .filter(Boolean)
      );
      
      setUserMemberships(roomNames);
    } catch (error) {
      console.error('Error fetching user memberships:', error);
    }
  };

  const fetchMemberCounts = async () => {
    try {
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('id, name');

      if (error) throw error;

      const counts: { [key: string]: number } = {};
      
      for (const room of rooms || []) {
        const { count, error: countError } = await supabase
          .from('memberships')
          .select('*', { count: 'exact', head: true })
          .eq('room_id', room.id);

        if (!countError) {
          counts[room.name.toLowerCase()] = count || 0;
        }
      }
      
      setMemberCounts(counts);
    } catch (error) {
      console.error('Error fetching member counts:', error);
    }
  };

  const updateCategoryWithMemberCounts = (items: any[]) => {
    return items.map(item => {
      const memberCount = memberCounts[item.name.toLowerCase()] || 0;
      const isUserMember = userMemberships.has(item.name.toLowerCase());
      
      return {
        ...item,
        members: memberCount,
        status: memberCount > 5 ? 'busy' as const : 
                memberCount > 0 ? 'active' as const : 'idle' as const,
        isUserMember
      };
    });
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => 
      prev.map(item => item.id === id ? { ...item, read: true } : item)
    );
  };
  
  const handleAccept = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && notification.roomId) {
      toast({
        title: "Request accepted",
        description: `You've accepted the request and joined ${notification.roomName || 'the room'}`,
      });
      
      navigate(`/chat?roomId=${notification.roomId}`);
    } else {
      toast({
        title: "Request accepted",
        description: "You've accepted the request",
      });
    }
    
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

  const handleJoinByCode = () => {
    setJoinByCodeOpen(true);
  };

  const handleRandomMatch = () => {
    const allItems = [
      ...updateCategoryWithMemberCounts(techTopicsData),
      ...updateCategoryWithMemberCounts(databaseData),
      ...updateCategoryWithMemberCounts(aiData),
      ...updateCategoryWithMemberCounts(dsaData)
    ];
    const randomTopic = allItems[Math.floor(Math.random() * allItems.length)];
    
    toast({
      title: "Random matching",
      description: `You've been matched with ${randomTopic.name}`,
    });
    
    setTimeout(() => {
      const randomRoomId = Math.floor(Math.random() * 10000);
      navigate(`/chat?topic=${encodeURIComponent(randomTopic.name)}&roomId=${randomRoomId}`);
    }, 1000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleItemClick = async (item: { name: string; isUserMember?: boolean }) => {
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join a room",
        variant: "destructive"
      });
      return;
    }

    // If user is already a member, navigate directly to the room
    if (item.isUserMember) {
      const { data: roomData } = await supabase
        .from('rooms')
        .select('id')
        .ilike('name', item.name)
        .single();

      if (roomData) {
        navigate(`/chat?roomId=${roomData.id}`);
        return;
      }
    }

    // Check if room exists
    const { data: existingRoom } = await supabase
      .from('rooms')
      .select('id, name')
      .ilike('name', item.name)
      .single();

    if (existingRoom) {
      // Join existing room
      const success = await joinRoom(
        existingRoom.id,
        authUser.user.id,
        userProfile.username || authUser.user.email || 'Unknown',
        null
      );

      if (success) {
        // Show success message and navigate
        toast({
          title: "Joined room",
          description: `Successfully joined ${item.name}`,
        });
        navigate(`/chat?roomId=${existingRoom.id}`);
        fetchMemberCounts();
        fetchUserMemberships();
      }
    } else {
      // Create new room
      const allCategoryItems = [
        ...techTopicsData,
        ...databaseData,
        ...aiData,
        ...dsaData,
        ...webDevData,
        ...devopsData
      ];
      const originalItem = allCategoryItems.find(cat => cat.name === item.name);
      const description = originalItem?.description || `Discussion about ${item.name}`;

      const room = await createRoom(
        item.name,
        description,
        item.name.toLowerCase(),
        '',
        10,
        'public',
        authUser.user.id,
        userProfile.username || authUser.user.email || 'Unknown',
        null
      );

      if (room) {
        toast({
          title: "Room created",
          description: `Created and joined ${room.name}`,
        });
        navigate(`/chat?roomId=${room.id}`);
        fetchMemberCounts();
        fetchUserMemberships();
      }
    }
  };

  const filteredTechTopics = updateCategoryWithMemberCounts(techTopicsData).filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredDatabaseTopics = updateCategoryWithMemberCounts(databaseData).filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredAiTopics = updateCategoryWithMemberCounts(aiData).filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredDsaTopics = updateCategoryWithMemberCounts(dsaData).filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredWebDevTopics = updateCategoryWithMemberCounts(webDevData).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredDevopsTopics = updateCategoryWithMemberCounts(devopsData).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AuthWrapper>
      {(user) => (
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Navbar />
          
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex justify-between items-center mb-6 mt-8">
              <h1 className="text-3xl font-bold">CodeHub</h1>
              <div className="flex items-center gap-4">
                <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="relative p-2">
                      <Bell className="w-5 h-5" />
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
                      )}
                    </Button>
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
              </div>
            </div>

            <HeroSection
              onSearch={handleSearch}
              onCreateRoom={() => setCreateRoomOpen(true)}
              onJoinByCode={() => setJoinByCodeOpen(true)}
              onRandomMatch={handleRandomMatch}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
              <div className="lg:col-span-2">
                <CategorySection
                  title="Programming & Tech"
                  items={filteredTechTopics}
                  onItemClick={handleItemClick}
                />
                
                <CategorySection
                  title="Web Development"
                  items={filteredWebDevTopics}
                  onItemClick={handleItemClick}
                />
                
                <CategorySection
                  title="DevOps & Tools"
                  items={filteredDevopsTopics}
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
              
              <div className="space-y-6">
                <MiniProfile username={userProfile.username !== 'guest' ? userProfile.username : undefined} />
                <UserRoomsPanel />
              </div>
            </div>
          </div>

          <JoinByCodeDialog 
            open={joinByCodeOpen} 
            onOpenChange={setJoinByCodeOpen} 
          />
          <CreateRoomDialog
            open={createRoomOpen}
            onOpenChange={setCreateRoomOpen}
          />
        </div>
      )}
    </AuthWrapper>
  );
};

export default CodeHub;
