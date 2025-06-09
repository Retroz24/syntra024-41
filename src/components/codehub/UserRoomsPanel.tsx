
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Share, MessageCircle, Crown } from 'lucide-react';
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
}

export default function UserRoomsPanel() {
  const [userRooms, setUserRooms] = useState<UserRoom[]>([]);
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
            table: 'memberships'
          },
          () => {
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
          () => {
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
      // Get rooms user is a member of
      const { data: membershipData, error: membershipError } = await supabase
        .from('memberships')
        .select(`
          room_id,
          rooms (
            id,
            name,
            description,
            icon_name,
            invite_code,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (membershipError) throw membershipError;

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
            isCreator
          };
        })
      );

      setUserRooms(roomsWithCounts.filter(room => room !== null) as UserRoom[]);
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Rooms</CardTitle>
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
        <CardTitle className="text-lg">My Rooms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {userRooms.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't joined any rooms yet.</p>
        ) : (
          userRooms.map(room => (
            <div key={room.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {getIconForLanguage(room.icon_name)}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{room.name}</h4>
                    {room.isCreator && (
                      <Crown className="h-3 w-3 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{room.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {room.memberCount}
                </Badge>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleJoinChat(room)}
                    className="h-6 px-2"
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleInvite(room)}
                    className="h-6 px-2"
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
