
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, X, Check, MessageSquare, Users } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface Notification {
  id: string;
  type: 'invite' | 'activity' | 'admin' | 'message';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable?: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onClearAll: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkRead,
  onAccept,
  onDecline,
  onClearAll
}) => {
  const { isDarkMode } = useDarkMode();
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch(type) {
      case 'invite': return <Users className="w-5 h-5 text-blue-500" />;
      case 'activity': return <Bell className="w-5 h-5 text-yellow-500" />;
      case 'admin': return <Users className="w-5 h-5 text-purple-500" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className={`w-full h-full flex flex-col ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 min-w-[20px] flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </div>
        
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs">
            Clear all
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-grow">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Bell className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No notifications yet</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-3 rounded-lg ${
                  notification.read 
                    ? isDarkMode ? 'bg-gray-800' : 'bg-gray-50' 
                    : isDarkMode ? 'bg-gray-800 border-l-4 border-blue-500' : 'bg-blue-50 border-l-4 border-blue-500'
                } transition-all hover:shadow-md`}
              >
                <div className="flex gap-3">
                  <div className="shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {notification.time}
                      </span>
                    </div>
                    
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    
                    {notification.actionable && (
                      <div className="flex gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 gap-1" 
                          onClick={() => onAccept(notification.id)}
                        >
                          <Check className="w-3 h-3" /> Accept
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 gap-1" 
                          onClick={() => onDecline(notification.id)}
                        >
                          <X className="w-3 h-3" /> Decline
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {!notification.actionable && !notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="shrink-0 h-8 w-8 p-0 rounded-full" 
                      onClick={() => onMarkRead(notification.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default NotificationPanel;
