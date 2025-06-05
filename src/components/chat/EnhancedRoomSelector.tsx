
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Share, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Room {
  id: string;
  slug: string;
  name: string;
  icon_name: string;
  description: string;
  status: string;
  max_members: number;
  invite_code: string;
  created_at: string;
  memberCount?: number;
}

interface EnhancedRoomSelectorProps {
  onSelectRoom: (room: Room) => void;
}

// Icon mapping for different programming languages
const getIconForLanguage = (iconName: string) => {
  const iconMap: { [key: string]: string } = {
    'javascript': '📜',
    'react': '⚛️',
    'python': '🐍',
    'java': '☕',
    'php': '🐘',
    'rust': '🦀',
    'swift': '🐦',
    'html': '🌐',
    'css': '🎨',
    'ruby': '💎',
    'go': '🐹',
    'cpp': '⚙️',
    'csharp': '#️⃣',
    'typescript': '🔷',
    'code': '💻'
  };
  return iconMap[iconName.toLowerCase()] || iconMap['code'];
};

export default function EnhancedRoomSelector({ onSelectRoom }: EnhancedRoomSelectorProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchRoomsWithCounts = async () => {
    try {
      // 1) Fetch all rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('id, slug, name, icon_name, description, status, max_members, invite_code, created_at')
        .order('created_at', { ascending: true });

      if (roomsError) throw roomsError;

      // 2) For each room, fetch count of memberships
      const roomsWithCounts = await Promise.all(
        (roomsData || []).map(async (room) => {
          const { count, error: countError } = await supabase
            .from('memberships')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', room.id);

          if (countError) {
            console.error(`Error counting memberships for ${room.name}:`, countError);
            return { ...room, memberCount: 0 };
          }
          return { ...room, memberCount: count || 0 };
        })
      );

      setRooms(roomsWithCounts);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load rooms",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomsWithCounts();

    // Subscribe to changes on rooms table
    const roomsSubscription = supabase
      .channel('rooms-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rooms' },
        () => {
          fetchRoomsWithCounts();
        }
      )
      .subscribe();

    // Subscribe to changes on memberships table
    const membershipsSubscription = supabase
      .channel('memberships-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'memberships' },
        () => {
          fetchRoomsWithCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomsSubscription);
      supabase.removeChannel(membershipsSubscription);
    };
  }, []);

  const handleInvite = async (room: Room) => {
    const inviteLink = `${window.location.origin}/invite?room_id=${room.id}&code=${room.invite_code}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Invite link copied!",
        description: "Share this link to invite others to the room",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Could not copy invite link",
        variant: "destructive"
      });
    }
  };

  const handleJoinRoom = async (room: Room) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join a room",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if user is already a member
      const { data: existingMembership } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('room_id', room.id)
        .single();

      if (!existingMembership) {
        // Add user to the room
        const { error } = await supabase
          .from('memberships')
          .insert({
            user_id: user.id,
            room_id: room.id
          });

        if (error) throw error;
      }

      onSelectRoom(room);
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: "Error",
        description: "Failed to join room",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'idle': 
      default: return 'bg-gray-400';
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading rooms…</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Select a Programming Language Room</h2>
        <p className="text-gray-600">Join a room to chat with other developers</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rooms.map(room => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-2xl">
                    {getIconForLanguage(room.icon_name)}
                  </span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <p className="text-sm text-gray-600">{room.description}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {/* Status & Member Count */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`} />
                  <span className="text-sm capitalize text-gray-700">{room.status}</span>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {room.memberCount || 0}
                </Badge>
              </div>

              {/* Buttons */}
              <div className="mt-auto space-y-2">
                <Button 
                  onClick={() => handleJoinRoom(room)}
                  className="w-full"
                >
                  Join
                </Button>
                <Button 
                  onClick={() => handleInvite(room)}
                  variant="outline" 
                  className="w-full"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create New Room Card */}
        <CreateRoomCard onRoomCreated={() => fetchRoomsWithCounts()} />
      </div>
    </div>
  );
}

// Create Room Card Component
function CreateRoomCard({ onRoomCreated }: { onRoomCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('code');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('idle');
  const [maxMembers, setMaxMembers] = useState(10);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Room name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
      
      // Generate invite code
      const { data: inviteCodeData, error: codeError } = await supabase
        .rpc('generate_invite_code');
      
      if (codeError) throw codeError;

      const { error } = await supabase
        .from('rooms')
        .insert({
          name: name.trim(),
          slug,
          icon_name: iconName,
          description: description.trim(),
          status,
          max_members: maxMembers,
          invite_code: inviteCodeData
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Room created successfully!"
      });

      // Reset form
      setName('');
      setIconName('code');
      setDescription('');
      setStatus('idle');
      setMaxMembers(10);
      setIsOpen(false);
      onRoomCreated();
    } catch (error: any) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create room",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-600 transition-colors"
      >
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Plus className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-lg font-medium text-gray-500">Create New Room</span>
        </CardContent>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4">Create a New Room</h2>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Room Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Elixir, Kotlin, etc."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Icon Name</label>
                <select
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="react">React</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="php">PHP</option>
                  <option value="rust">Rust</option>
                  <option value="swift">Swift</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="ruby">Ruby</option>
                  <option value="go">Go</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                  <option value="typescript">TypeScript</option>
                  <option value="code">Code (Default)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Short description (e.g. 'Dynamic language')"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Max Members</label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value) || 10)}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creating…' : 'Create Room'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
