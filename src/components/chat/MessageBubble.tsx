
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Trash2, Save, X, Heart, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  user_id: string;
  content: string;
  inserted_at: string;
  updated_at: string;
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onEdit: (messageId: string, content: string) => void;
  onDelete: (messageId: string) => void;
}

export default function MessageBubble({ message, isOwnMessage, onEdit, onDelete }: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const [liked, setLiked] = useState(false);

  const handleSaveEdit = () => {
    if (draft.trim() && draft !== message.content) {
      onEdit(message.id, draft.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setDraft(message.content);
    setIsEditing(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3 group`}>
      <div className={`max-w-[70%] space-y-1 ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        {/* Message Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-sm ${
            isOwnMessage
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md'
          }`}
        >
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className={`min-h-[60px] resize-none border-0 p-0 ${
                  isOwnMessage 
                    ? 'bg-transparent text-white placeholder-gray-200' 
                    : 'bg-transparent'
                }`}
                placeholder="Edit your message..."
                rows={2}
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleCancelEdit}
                  className={isOwnMessage ? 'text-white hover:bg-white/20' : ''}
                >
                  <X className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveEdit}
                  className={`${
                    isOwnMessage 
                      ? 'bg-white/20 text-white hover:bg-white/30' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          )}
        </div>
        
        {/* Message Footer */}
        <div className={`flex items-center space-x-2 px-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500">
            {formatTime(message.inserted_at)}
          </span>
          
          {message.updated_at !== message.inserted_at && (
            <span className="text-xs text-gray-400 italic">edited</span>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isOwnMessage && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setLiked(!liked)}
                className={`h-6 w-6 p-0 ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart className={`h-3 w-3 ${liked ? 'fill-current' : ''}`} />
              </Button>
            )}
            
            {isOwnMessage && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(message.id)}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
