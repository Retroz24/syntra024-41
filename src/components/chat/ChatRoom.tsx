
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Users, Smile, Paperclip, Mic, Camera } from 'lucide-react';
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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
      inputRef.current?.focus();
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
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading chat room...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Please log in to access the chat room.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-black">
      {/* Header - Instagram-like */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLeave}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {room.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{room.name} Room</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {memberCount} member{memberCount !== 1 ? 's' : ''} online
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-1">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">No messages yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">Be the first to start the conversation!</p>
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

      {/* Input Area - Instagram-like */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="pr-12 rounded-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                maxLength={1000}
              />
              
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                >
                  <Smile className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <Paperclip className="h-5 w-5 text-gray-500" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <Camera className="h-5 w-5 text-gray-500" />
              </Button>
              
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className={`p-2 rounded-full transition-all ${
                  newMessage.trim()
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}
