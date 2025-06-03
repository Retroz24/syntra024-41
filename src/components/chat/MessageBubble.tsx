
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Edit2, Trash2, Save, X } from 'lucide-react';

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

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="max-w-md space-y-1">
        <Card className={`p-3 ${isOwnMessage ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="min-h-[60px] resize-none"
                rows={2}
              />
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-3 w-3" />
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </Card>
        
        <div className={`flex items-center text-xs text-gray-500 space-x-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
          <span>{new Date(message.inserted_at).toLocaleTimeString()}</span>
          {message.updated_at !== message.inserted_at && (
            <span className="italic">(edited)</span>
          )}
          {isOwnMessage && !isEditing && (
            <div className="flex space-x-1">
              <button
                className="hover:text-blue-600 p-1"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-3 w-3" />
              </button>
              <button
                className="hover:text-red-600 p-1"
                onClick={() => onDelete(message.id)}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
