
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { QrCode, User, Link, MessageSquare } from 'lucide-react';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  roomType: string;
  onJoin: (asGuest: boolean, username?: string) => void;
  onCreateCustom: (name: string) => void;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  isOpen,
  onClose,
  roomName,
  roomType,
  onJoin,
  onCreateCustom
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [customRoomName, setCustomRoomName] = React.useState('');
  const [isJoining, setIsJoining] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('join');
  
  // Generate a random room code
  const roomCode = React.useMemo(() => Math.random().toString(36).substr(2, 9).toUpperCase(), []);
  
  const handleJoinAsGuest = () => {
    setIsJoining(true);
    setTimeout(() => {
      onJoin(true);
      setIsJoining(false);
      toast({
        title: "Joined as guest",
        description: `You've joined ${roomName} as a guest`,
      });
    }, 1000);
  };
  
  const handleJoinWithUsername = () => {
    if (!username) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue",
        variant: "destructive",
      });
      return;
    }
    
    setIsJoining(true);
    setTimeout(() => {
      onJoin(false, username);
      setIsJoining(false);
      toast({
        title: "Welcome aboard!",
        description: `You've joined ${roomName} as ${username}`,
      });
    }, 1000);
  };
  
  const handleCreateCustomRoom = () => {
    if (!customRoomName) {
      toast({
        title: "Room name required",
        description: "Please enter a name for your custom room",
        variant: "destructive",
      });
      return;
    }
    
    setIsJoining(true);
    setTimeout(() => {
      onCreateCustom(customRoomName);
      setIsJoining(false);
      toast({
        title: "Room created!",
        description: `Your ${roomType} room "${customRoomName}" has been created`,
      });
    }, 1000);
  };
  
  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast({
      title: "Copied to clipboard!",
      description: "Room invite code has been copied",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>{roomName}</span>
          </DialogTitle>
          <DialogDescription>
            Join an existing {roomType} room or create a custom one.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="join" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="join">Join Room</TabsTrigger>
            <TabsTrigger value="create">Create Custom</TabsTrigger>
            <TabsTrigger value="invite">Invite Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="join" className="mt-4">
            <div className="grid gap-4">
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username (optional)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      className="pl-10"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-2">
                <Button 
                  onClick={handleJoinWithUsername}
                  disabled={isJoining}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isJoining ? "Joining..." : "Join with Username"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleJoinAsGuest}
                  disabled={isJoining}
                >
                  {isJoining ? "Joining..." : "Join as Guest"}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="create" className="mt-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="custom-room">Custom Room Name</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="custom-room"
                    placeholder="Enter a name for your custom room"
                    className="pl-10"
                    value={customRoomName}
                    onChange={(e) => setCustomRoomName(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleCreateCustomRoom}
                disabled={isJoining}
                className="bg-blue-600 hover:bg-blue-700 mt-2"
              >
                {isJoining ? "Creating..." : `Create ${roomType} Room`}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="invite" className="mt-4">
            <div className="grid gap-4">
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                <QrCode className="w-32 h-32 mb-4 text-purple-600" />
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Scan QR code or use invite code</p>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-lg font-mono">
                      {roomCode}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCopyInviteCode}
                      className="text-blue-600"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomModal;
