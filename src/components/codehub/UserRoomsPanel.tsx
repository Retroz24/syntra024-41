import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Share, MessageCircle, Crown, Clock, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UserRoom {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  invite_code: string;
  memberCount: number;
  isCreator: boolean;
  joinedAt: string;
}

export default function UserRoomsPanel() {
  const [userRooms, setUserRooms] = useState<UserRoom[]>([]);
  const [totalRoomsJoined, setTotalRoomsJoined] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserRooms();
      
      // Set up real-time subscription for membership changes
      const membershipChannel = supabase
        .channel('user-membership-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'memberships',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Membership change detected:', payload);
            fetchUserRooms();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rooms'
          },
          (payload) => {
            console.log('Room change detected:', payload);
            fetchUserRooms();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(membershipChannel);
      };
    }
  }, [user]);

  const fetchUserRooms = async () => {
    if (!user) return;

    try {
      console.log('Fetching user rooms for user:', user.id);
      
      // Get rooms user is a member of with join timestamp
      const { data: membershipData, error: membershipError } = await supabase
        .from('memberships')
        .select(`
          room_id,
          joined_at,
          rooms (
            id,
            name,
            description,
            icon_name,
            invite_code,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false });

      if (membershipError) {
        console.error('Error fetching memberships:', membershipError);
        throw membershipError;
      }

      console.log('Membership data:', membershipData);
      setTotalRoomsJoined(membershipData?.length || 0);

      // Get member counts for each room and check if user is creator
      const roomsWithCounts = await Promise.all(
        (membershipData || []).map(async (membership: any) => {
          const room = membership.rooms;
          if (!room) return null;

          // Get member count
          const { count, error: countError } = await supabase
            .from('memberships')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', room.id);

          if (countError) {
            console.error('Error counting members:', countError);
            return null;
          }

          // Check if user is the room creator (first member joined)
          const { data: firstMember, error: firstMemberError } = await supabase
            .from('memberships')
            .select('user_id')
            .eq('room_id', room.id)
            .order('joined_at', { ascending: true })
            .limit(1)
            .single();

          const isCreator = !firstMemberError && firstMember?.user_id === user.id;

          return {
            id: room.id,
            name: room.name,
            description: room.description,
            icon_name: room.icon_name,
            invite_code: room.invite_code,
            memberCount: count || 0,
            isCreator,
            joinedAt: membership.joined_at
          };
        })
      );

      const validRooms = roomsWithCounts.filter(room => room !== null) as UserRoom[];
      console.log('Valid rooms:', validRooms);
      setUserRooms(validRooms);
    } catch (error) {
      console.error('Error fetching user rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load your rooms",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (room: UserRoom) => {
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

  const handleJoinChat = (room: UserRoom) => {
    console.log('Joining chat for room:', room.id);
    navigate(`/chat?roomId=${room.id}`);
  };

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
      'angular': '🅰️',
      'vue': '💚',
      'nodejs': '💚',
      'express': '🚂',
      'docker': '🐳',
      'kubernetes': '⚙️',
      'jenkins': '🤖',
      'aws': '☁️',
      'git': '📚',
      'mongodb': '🍃',
      'postgresql': '🐘',
      'mysql': '🐬',
      'redis': '🔴',
      'cassandra': '👁️',
      'sqlite': '🗄️',
      'firebase': '🔥',
      'dynamodb': '⚡',
      'code': '💻'
    };
    return iconMap[iconName?.toLowerCase()] || iconMap['code'];
  };

  const formatJoinedTime = (joinedAt: string) => {
    const date = new Date(joinedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Hash className="h-4 w-4" />
            My Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            My Rooms
          </div>
          <Badge variant="secondary" className="ml-2">
            {totalRoomsJoined} joined
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {userRooms.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-2">You haven't joined any rooms yet.</p>
            <p className="text-xs text-gray-400">Join a room from the categories above to get started!</p>
          </div>
        ) : (
          userRooms.map(room => (
            <div key={room.id} className="border rounded-lg p-3 space-y-2 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {getIconForLanguage(room.icon_name)}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{room.name}</h4>
                    {room.isCreator && (
                      <div title="Room Creator">
                        <Crown className="h-3 w-3 text-yellow-500" />
                      </div>
                    )}
                    <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                      Joined
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{room.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatJoinedTime(room.joinedAt)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span className="font-medium">{room.memberCount}</span>
                  <span className="text-xs">members</span>
                </Badge>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleJoinChat(room)}
                    className="h-6 px-2"
                    title="Join chat"
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleInvite(room)}
                    className="h-6 px-2"
                    title="Share invite link"
                  >
                    <Share className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
