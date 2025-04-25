
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Code, Database, Brain } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RoomData {
  id: number;
  name: string;
  description: string;
  type: string;
  category: string;
  maxMembers: number;
  focusArea: string;
  members: { id: number; name: string; status: string; isAdmin?: boolean }[];
  resources: { title: string; url: string }[];
}

export function CreateRoomDialog({ open, onOpenChange }: CreateRoomDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [roomType, setRoomType] = useState('public');
  const [category, setCategory] = useState('programming');
  const [programmingLanguage, setProgrammingLanguage] = useState('JavaScript');
  const [maxMembers, setMaxMembers] = useState('10');
  const [focusArea, setFocusArea] = useState('code');
  const [isLoading, setIsLoading] = useState(false);
  
  const [createdRooms, setCreatedRooms] = useLocalStorage<RoomData[]>('created-rooms', []);
  const [userProfile] = useLocalStorage<any>('user-profile', { username: 'DevUser', status: 'online' });

  const handleCreateRoom = () => {
    if (!roomName) {
      toast({
        title: "Room name required",
        description: "Please provide a name for your room",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Create a new room with the selected options
    const roomId = Math.floor(Math.random() * 10000);
    
    const newRoom: RoomData = {
      id: roomId,
      name: roomName,
      description: roomDescription,
      type: roomType,
      category: category === 'programming' ? programmingLanguage : category,
      maxMembers: parseInt(maxMembers),
      focusArea: focusArea,
      members: [{
        id: 1,
        name: userProfile.username || 'DevUser',
        status: 'online',
        isAdmin: true
      }],
      resources: []
    };
    
    // Save room to local storage
    setCreatedRooms([...createdRooms, newRoom]);
    
    setTimeout(() => {
      toast({
        title: "Room Created!",
        description: `Your room "${roomName}" has been created successfully.`
      });
      
      setIsLoading(false);
      onOpenChange(false);
      
      // Reset form
      setRoomName('');
      setRoomDescription('');
      setRoomType('public');
      setCategory('programming');
      setProgrammingLanguage('JavaScript');
      setMaxMembers('10');
      setFocusArea('code');
      
      // Navigate to the new room
      navigate(`/room/${roomId}`);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a New Room</DialogTitle>
          <DialogDescription>
            Set up a new study room for collaborative learning and discussions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room-name" className="text-right">
              Room Name
            </Label>
            <Input
              id="room-name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. React Hooks Mastery"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
              placeholder="Brief description of the room's focus"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room-type" className="text-right">
              Room Type
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="room-type"
                checked={roomType === "private"}
                onCheckedChange={(checked) => setRoomType(checked ? "private" : "public")}
              />
              <Label htmlFor="room-type" className="cursor-pointer">
                {roomType === "private" ? "Private Room" : "Public Room"}
              </Label>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="programming">Programming Languages</SelectItem>
                <SelectItem value="dsa">Data Structures & Algorithms</SelectItem>
                <SelectItem value="database">Databases</SelectItem>
                <SelectItem value="ai">AI & Machine Learning</SelectItem>
                <SelectItem value="web">Web Development</SelectItem>
                <SelectItem value="mobile">Mobile Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {category === 'programming' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="language" className="text-right">
                Language
              </Label>
              <Select
                value={programmingLanguage}
                onValueChange={setProgrammingLanguage}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="TypeScript">TypeScript</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value="Go">Go</SelectItem>
                  <SelectItem value="React">React</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="max-members" className="text-right">
              Max Members
            </Label>
            <Select
              value={maxMembers}
              onValueChange={setMaxMembers}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select max members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 members</SelectItem>
                <SelectItem value="10">10 members</SelectItem>
                <SelectItem value="20">20 members</SelectItem>
                <SelectItem value="50">50 members</SelectItem>
                <SelectItem value="100">100 members</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Focus Area
            </Label>
            <div className="col-span-3">
              <ToggleGroup type="single" defaultValue={focusArea} value={focusArea} onValueChange={(val) => val && setFocusArea(val)}>
                <ToggleGroupItem value="code" aria-label="Code">
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </ToggleGroupItem>
                <ToggleGroupItem value="database" aria-label="Database">
                  <Database className="h-4 w-4 mr-2" />
                  Database
                </ToggleGroupItem>
                <ToggleGroupItem value="ai" aria-label="AI">
                  <Brain className="h-4 w-4 mr-2" />
                  AI
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleCreateRoom} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
