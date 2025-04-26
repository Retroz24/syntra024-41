
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AvatarPicker } from "../components/ui/avatar-picker";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface UserAvatar {
  avatarId: number | null;
  customImage: string | null;
}

export default function AvatarProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [userAvatar, setUserAvatar] = useLocalStorage<UserAvatar>("userAvatar", {
    avatarId: 1,
    customImage: null
  });

  useEffect(() => {
    // Try to get username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSaveAvatar = (avatarId: number | null, customImage: string | null) => {
    setUserAvatar({
      avatarId,
      customImage
    });
    
    toast.success("Avatar saved successfully!");
    
    // Redirect to profile or previous page
    setTimeout(() => {
      navigate(-1);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Customize Your Avatar</h1>
          <p className="text-muted-foreground mt-2">
            Choose an avatar that will represent you in chat rooms and discussions
          </p>
        </div>

        <AvatarPicker 
          username={username || "Me"}
          onSaveAvatar={handleSaveAvatar}
        />
        
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate(-1)} className="mr-4">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
