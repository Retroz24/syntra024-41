
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RoomJoinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomName: string;
  roomId: string;
  category: string;
}

export function RoomJoinDialog({
  open,
  onOpenChange,
  roomName,
  roomId,
  category
}: RoomJoinDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleJoin = () => {
    toast({
      title: "Joined successfully!",
      description: `You've joined ${roomName}`,
    });
    navigate(`/chat?roomId=${roomId}&category=${category}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join {roomName}</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          You're about to join this room. Once inside, you can participate in discussions
          and collaborate with other members.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleJoin}>Join Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
