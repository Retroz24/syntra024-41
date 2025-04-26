
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateRoomDialog: React.FC<CreateRoomDialogProps> = ({ open, onOpenChange }) => {
  const [roomName, setRoomName] = React.useState('');
  const [maxMembers, setMaxMembers] = React.useState('10');
  const [isPrivate, setIsPrivate] = React.useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      toast({
        title: "Room name required",
        description: "Please enter a name for your room",
        variant: "destructive"
      });
      return;
    }

    // Generate a unique room ID
    const roomId = Math.floor(Math.random() * 10000);
    
    // Store the room data in localStorage to persist between page loads
    const existingRooms = JSON.parse(localStorage.getItem('created-rooms') || '[]');
    const newRoom = {
      id: roomId,
      name: roomName,
      maxMembers: parseInt(maxMembers),
      type: isPrivate ? 'private' : 'public',
      members: [{
        id: 1,
        name: 'You',
        status: 'online',
        isAdmin: true
      }],
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('created-rooms', JSON.stringify([...existingRooms, newRoom]));
    
    // Navigate to the new room with the necessary state information
    navigate(`/room/${roomId}`, {
      state: {
        roomName,
        maxMembers: parseInt(maxMembers),
        isPrivate
      }
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Create a New Room</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxMembers">Maximum Members</Label>
            <Input
              id="maxMembers"
              type="number"
              min="2"
              max="50"
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isPrivate">Private Room</Label>
            <Switch
              id="isPrivate"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>
          <Button onClick={handleCreateRoom} className="w-full">
            Create Room
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomDialog;
