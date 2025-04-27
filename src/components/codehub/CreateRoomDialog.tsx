
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Share, QrCode } from 'lucide-react';  // Changed from @/components/ui/icons to lucide-react
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
  const [category, setCategory] = React.useState('programming');
  const [description, setDescription] = React.useState('');
  const [inviteCode, setInviteCode] = React.useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
      setInviteCode(Math.random().toString(36).substring(7).toUpperCase());
    }
  }, [open]);

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      toast({
        title: "Room name required",
        description: "Please enter a name for your room",
        variant: "destructive"
      });
      return;
    }

    const roomId = Math.floor(Math.random() * 10000);
    
    const existingRooms = JSON.parse(localStorage.getItem('created-rooms') || '[]');
    const newRoom = {
      id: roomId,
      name: roomName,
      description,
      maxMembers: parseInt(maxMembers),
      category,
      type: isPrivate ? 'private' : 'public',
      inviteCode,
      members: [{
        id: 1,
        name: 'You',
        status: 'online',
        isAdmin: true
      }],
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('created-rooms', JSON.stringify([...existingRooms, newRoom]));
    
    navigate(`/chat?roomId=${roomId}`, {
      state: {
        roomName,
        category,
        maxMembers: parseInt(maxMembers),
        isPrivate,
        isAdmin: true
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
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the room"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="programming">Programming & Tech</SelectItem>
                <SelectItem value="webdev">Web Development</SelectItem>
                <SelectItem value="devops">DevOps & Tools</SelectItem>
                <SelectItem value="database">Databases</SelectItem>
                <SelectItem value="ai">AI & ML</SelectItem>
                <SelectItem value="dsa">DSA</SelectItem>
              </SelectContent>
            </Select>
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

          <div className="space-y-2 pt-4 border-t">
            <Label>Room Invite Code</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted p-2 rounded text-sm font-mono">
                {inviteCode}
              </code>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(inviteCode);
                  toast({
                    title: "Copied!",
                    description: "Invite code copied to clipboard",
                  });
                }}
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
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
