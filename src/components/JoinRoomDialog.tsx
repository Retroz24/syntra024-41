
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface JoinRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: number;
  roomName: string;
  roomLanguage: string;
}

const JoinRoomDialog = ({ open, onOpenChange, roomId, roomName, roomLanguage }: JoinRoomDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const [message, setMessage] = React.useState('');
  const [isRequesting, setIsRequesting] = React.useState(false);
  const [roomsData, setRoomsData] = useLocalStorage<any[]>('created-rooms', []);

  const handleJoin = () => {
    setIsRequesting(true);
    
    // Find the room
    const room = roomsData.find(r => r.id === roomId);
    
    if (!room) {
      toast({
        title: "Room not found",
        description: "This room may have been deleted.",
        variant: "destructive"
      });
      setIsRequesting(false);
      onOpenChange(false);
      return;
    }
    
    // Add join request notification for room admin
    const updatedRooms = roomsData.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          joinRequests: [...(r.joinRequests || []), {
            id: Date.now(),
            userId: userProfile.id || Date.now(),
            username: userProfile.username || 'Guest',
            message: message || 'I would like to join this room.',
            timestamp: new Date().toISOString()
          }]
        };
      }
      return r;
    });
    
    setRoomsData(updatedRooms);
    
    // Simulate request to join being sent to admin
    setTimeout(() => {
      toast({
        title: "Request sent to room admin",
        description: "You'll be notified when your request is approved.",
      });
      setIsRequesting(false);
      onOpenChange(false);
      
      // Simulate admin approval after 2 seconds
      setTimeout(() => {
        // Update rooms data to include the user
        const updatedRoomsWithUser = roomsData.map(r => {
          if (r.id === roomId) {
            return {
              ...r,
              members: [...r.members, {
                id: userProfile.id || Date.now(),
                name: userProfile.username || 'Guest',
                status: 'online',
              }],
              // Remove the request
              joinRequests: (r.joinRequests || []).filter((req: any) => 
                req.userId !== (userProfile.id || Date.now())
              )
            };
          }
          return r;
        });
        
        setRoomsData(updatedRoomsWithUser);
        
        toast({
          title: "Request approved!",
          description: "You've been added to the room.",
        });
        navigate(`/room/${roomId}`);
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join {roomName}</DialogTitle>
          <DialogDescription>
            Send a request to join this {roomLanguage} study room. The room admin will need to approve your request.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Message
            </Label>
            <Input
              id="reason"
              placeholder="Why do you want to join this room?"
              className="col-span-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={isRequesting}>
            {isRequesting ? "Sending request..." : "Send join request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomDialog;
