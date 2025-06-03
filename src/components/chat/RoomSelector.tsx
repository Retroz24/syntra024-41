
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface Room {
  id: string;
  slug: string;
  name: string;
  created_at: string;
}

interface RoomSelectorProps {
  onSelectRoom: (room: Room) => void;
}

export default function RoomSelector({ onSelectRoom }: RoomSelectorProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
    fetchMemberCounts();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('id, slug, name, created_at')
        .order('name', { ascending: true });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('room_id');

      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data?.forEach(membership => {
        counts[membership.room_id] = (counts[membership.room_id] || 0) + 1;
      });
      
      setMemberCounts(counts);
    } catch (error) {
      console.error('Error fetching member counts:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading rooms...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Select a Programming Language Room</h2>
        <p className="text-gray-600">Join a room to chat with other developers</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectRoom(room)}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>{room.name}</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {memberCounts[room.id] || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Join {room.name} Room
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
