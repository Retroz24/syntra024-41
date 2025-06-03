
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Users } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useToast } from '@/hooks/use-toast';

interface Room {
  id: string;
  slug: string;
  name: string;
  created_at: string;
}

interface Message {
  id: string;
  user_id: string;
  content: string;
  inserted_at: string;
  updated_at: string;
}

interface ChatRoomProps {
  room: Room;
  onLeave: () => void;
}

export default function ChatRoom({ room, onLeave }: ChatRoomProps) {
  const [user, setUser] = useState<any>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user || !room) return;

    const initializeRoom = async () => {
      await addMembership();
      await fetchMessages();
      await fetchMemberCount();
      setLoading(false);
    };

    initializeRoom();

    // Set up real-time subscriptions
    const membershipChannel = supabase
      .channel('memberships')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'memberships',
          filter: `room_id=eq.${room.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMemberCount(prev => prev + 1);
          } else if (payload.eventType === 'DELETE') {
            setMemberCount(prev => Math.max(prev - 1, 0));
          }
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${room.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${room.id}`
        },
        (payload) => {
          setMessages(prev =>
            prev.map(m => (m.id === payload.new.id ? payload.new as Message : m))
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${room.id}`
        },
        (payload) => {
          setMessages(prev => prev.filter(m => m.id !== payload.old.id));
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      removeMembership();
      supabase.removeChannel(membershipChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [user, room]);

  const addMembership = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('memberships')
        .insert({ user_id: user.id, room_id: room.id });
      
      if (error && !error.message.includes('duplicate key')) {
        console.error('Error joining room:', error);
      }
    } catch (error) {
      console.error('Error adding membership:', error);
    }
  };

  const removeMembership = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('memberships')
        .delete()
        .eq('user_id', user.id)
        .eq('room_id', room.id);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, user_id, content, inserted_at, updated_at')
        .eq('room_id', room.id)
        .order('inserted_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchMemberCount = async () => {
    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('user_id')
        .eq('room_id', room.id);

      if (error) throw error;
      setMemberCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching member count:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          room_id: room.id,
          content: newMessage.trim(),
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateMessage = async (messageId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ content })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating message:', error);
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return <div className="p-4">Loading chat room...</div>;
  }

  if (!user) {
    return <div className="p-4">Please log in to access the chat room.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={onLeave}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h3 className="text-lg font-semibold">{room.name} Room</h3>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {memberCount} member{memberCount !== 1 ? 's' : ''} online
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Be the first to say hello!
            </div>
          ) : (
            messages.map(message => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.user_id === user.id}
                onEdit={updateMessage}
                onDelete={deleteMessage}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <Card className="rounded-none border-x-0 border-b-0">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
