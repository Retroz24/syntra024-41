
import { useState } from 'react';
import { AvatarPicker } from '@/components/ui/avatar-picker';
import Navbar from '@/components/Navbar';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AvatarProfile() {
  const { userProfile, updateUserProfile } = useUser();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);

  const handleSaveAvatar = (avatarId: number | null, customImage: string | null) => {
    // Save to userProfile
    updateUserProfile({
      avatarId: avatarId,
      customImage: customImage
    });

    // Save to localStorage for persistence
    localStorage.setItem("userAvatar", JSON.stringify({
      avatarId,
      customImage
    }));

    setSaved(true);
    
    toast({
      title: "Avatar saved!",
      description: "Your new avatar has been saved successfully.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      
      <div className="container max-w-4xl mx-auto pt-24 pb-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Choose Your Avatar</CardTitle>
          </CardHeader>
          <CardContent>
            <AvatarPicker 
              username={userProfile.username !== 'guest' ? userProfile.username : 'Me'} 
              onSaveAvatar={handleSaveAvatar} 
            />
            
            {saved && (
              <p className="text-center text-green-500 mt-4">
                Your avatar has been saved successfully!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
