
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight } from 'lucide-react';

export default function InvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const roomId = searchParams.get('room_id');
  const inviteCode = searchParams.get('code');

  useEffect(() => {
    const processInvite = async () => {
      if (!roomId) {
        toast({
          title: "Invalid invite",
          description: "Room ID is missing from invite link",
          variant: "destructive"
        });
        navigate('/chat');
        return;
      }

      try {
        // Fetch room details
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single();

        if (roomError || !roomData) {
          toast({
            title: "Room not found",
            description: "This invite link may be invalid or expired",
            variant: "destructive"
          });
          navigate('/chat');
          return;
        }

        // Verify invite code if provided
        if (inviteCode && roomData.invite_code !== inviteCode) {
          toast({
            title: "Invalid invite code",
            description: "This invite link appears to be invalid",
            variant: "destructive"
          });
          navigate('/chat');
          return;
        }

        setRoom(roomData);

        // If user is authenticated, auto-join
        if (user) {
          await joinRoom(roomData);
        }
      } catch (error) {
        console.error('Error processing invite:', error);
        toast({
          title: "Error",
          description: "Failed to process invite",
          variant: "destructive"
        });
        navigate('/chat');
      } finally {
        setLoading(false);
      }
    };

    processInvite();
  }, [roomId, inviteCode, user]);

  const joinRoom = async (roomData: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join this room",
        variant: "destructive"
      });
      return;
    }

    setJoining(true);
    try {
      // Check if user is already a member
      const { data: existingMembership } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('room_id', roomData.id)
        .single();

      if (!existingMembership) {
        // Check if room is full
        const { count } = await supabase
          .from('memberships')
          .select('*', { count: 'exact', head: true })
          .eq('room_id', roomData.id);

        if (count && count >= roomData.max_members) {
          toast({
            title: "Room is full",
            description: "This room has reached its maximum capacity",
            variant: "destructive"
          });
          return;
        }

        // Add user to the room
        const { error } = await supabase
          .from('memberships')
          .insert({
            user_id: user.id,
            room_id: roomData.id
          });

        if (error) throw error;

        toast({
          title: "Joined successfully!",
          description: `You've joined ${roomData.name}`,
        });
      } else {
        toast({
          title: "Already a member",
          description: `You're already a member of ${roomData.name}`,
        });
      }

      // Navigate to chat room
      navigate('/chat', { 
        state: { selectedRoom: roomData }
      });
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: "Error",
        description: "Failed to join room",
        variant: "destructive"
      });
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing invite...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Invalid or expired invite link</p>
            <Button 
              onClick={() => navigate('/chat')} 
              className="mt-4"
            >
              Go to Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
            <span className="text-white text-2xl">
              {room.icon_name === 'react' ? '⚛️' : 
               room.icon_name === 'javascript' ? '📜' : 
               room.icon_name === 'python' ? '🐍' : '💻'}
            </span>
          </div>
          <CardTitle className="text-2xl">Join {room.name}</CardTitle>
          <p className="text-gray-600">{room.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${
                room.status === 'active' ? 'bg-green-500' : 
                room.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
              }`} />
              <span className="capitalize">{room.status}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Max {room.max_members} members</span>
            </div>
          </div>

          {user ? (
            <Button 
              onClick={() => joinRoom(room)}
              disabled={joining}
              className="w-full"
            >
              {joining ? 'Joining...' : (
                <>
                  Join Room
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                You need to sign in to join this room
              </p>
              <Button 
                onClick={() => navigate('/', { 
                  state: { redirect: `/invite?room_id=${roomId}&code=${inviteCode}` }
                })}
                className="w-full"
              >
                Sign In to Join
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/chat')}
              className="text-sm"
            >
              Browse other rooms
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
