
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface JoinByCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinByCodeDialog: React.FC<JoinByCodeDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [code, setCode] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 5) {
      toast({
        title: "Invalid invite code",
        description: "Please enter a valid room invite code",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate room joining
    setTimeout(() => {
      const fakeRoomId = Math.floor(Math.random() * 10000);
      toast({
        title: "Room found!",
        description: "Joining room...",
      });
      
      setTimeout(() => {
        setIsSubmitting(false);
        onOpenChange(false);
        navigate(`/room/${fakeRoomId}`);
      }, 1000);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Room by Code</DialogTitle>
          <DialogDescription>
            Enter a room invite code to join an existing study room.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="code"
                placeholder="Enter invite code (e.g. XJ38FG)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="col-span-4"
                autoCapitalize="characters"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinByCodeDialog;
