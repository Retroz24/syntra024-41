
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileUploadProps {
  currentImage?: string;
  username: string;
  onImageUpdate: (image: string) => void;
}

const ProfileUpload: React.FC<ProfileUploadProps> = ({ currentImage, username, onImageUpdate }) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onImageUpdate(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer group">
          <Avatar className="w-20 h-20 border-2 border-purple-500">
            <AvatarImage src={previewUrl} />
            <AvatarFallback className="bg-purple-100 text-purple-800 text-xl">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={previewUrl} />
              <AvatarFallback className="bg-purple-100 text-purple-800 text-2xl">
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2">
            <Label htmlFor="picture">Choose a picture</Label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileUpload;
