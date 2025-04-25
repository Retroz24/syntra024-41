
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, Code } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface Room {
  id: number;
  name: string;
  type: string;
  isAdmin: boolean;
}

interface MiniProfileProps {
  username: string;
  avatarUrl?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  role: 'Guest' | 'Admin' | 'Member';
  joinedRooms: Room[];
  onViewProfile: () => void;
  onLeaveRoom: (roomId: number) => void;
  onTransferOwnership: (roomId: number) => void;
}

const MiniProfile: React.FC<MiniProfileProps> = ({
  username,
  avatarUrl,
  status,
  role,
  joinedRooms,
  onViewProfile,
  onLeaveRoom,
  onTransferOwnership
}) => {
  const { isDarkMode } = useDarkMode();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Guest': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  return (
    <Card className={`w-full ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-14 h-14 border-2 border-purple-500">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-purple-100 text-purple-800">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{username}</h3>
              <Badge className={getRoleBadgeColor(role)}>{role}</Badge>
            </div>
            
            <div className="flex items-center gap-1 mt-1">
              <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(status)}`}></span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {getStatusText(status)}
              </span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mb-4" 
          size="sm"
          onClick={onViewProfile}
        >
          <User className="w-4 h-4 mr-2" /> View Full Profile
        </Button>
        
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Joined Rooms</h4>
            <Badge variant="outline" className="text-xs">
              {joinedRooms.length}
            </Badge>
          </div>
          
          {joinedRooms.length === 0 ? (
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              You haven't joined any rooms yet
            </p>
          ) : (
            <div className="space-y-2">
              {joinedRooms.map((room) => (
                <div key={room.id} className={`p-2 rounded-md ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} mr-2`}>
                        <Code className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{room.name}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{room.type}</p>
                      </div>
                    </div>
                    
                    {room.isAdmin && (
                      <Badge variant="secondary" className="text-xs">Admin</Badge>
                    )}
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex items-center justify-between gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 text-xs w-full" 
                      onClick={() => onLeaveRoom(room.id)}
                    >
                      <LogOut className="w-3 h-3 mr-1" /> Leave
                    </Button>
                    
                    {room.isAdmin && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 text-xs w-full" 
                        onClick={() => onTransferOwnership(room.id)}
                      >
                        <Settings className="w-3 h-3 mr-1" /> Transfer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniProfile;
