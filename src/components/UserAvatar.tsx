
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

// Import the avatar components
import { avatars } from "../utils/avatarUtils";

interface UserAvatarProps {
  username?: string;
  avatarId?: number | null;
  customImage?: string | null;
  size?: "sm" | "md" | "lg";
}

export default function UserAvatar({ 
  username, 
  avatarId = null, 
  customImage = null,
  size = "md" 
}: UserAvatarProps) {
  const [userInitial, setUserInitial] = useState("U");
  const [storedAvatar, setStoredAvatar] = useState<{
    avatarId: number | null;
    customImage: string | null;
  } | null>(null);

  useEffect(() => {
    if (username) {
      setUserInitial(username.charAt(0).toUpperCase());
    }
    
    // If no avatar is provided, try to get it from localStorage
    if (!avatarId && !customImage) {
      const savedAvatar = localStorage.getItem("userAvatar");
      if (savedAvatar) {
        try {
          const parsed = JSON.parse(savedAvatar);
          setStoredAvatar(parsed);
        } catch (e) {
          console.error("Failed to parse stored avatar:", e);
        }
      }
    }
  }, [username, avatarId, customImage]);

  // Determine avatar size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  // Use provided avatar or fallback to stored one
  const effectiveAvatarId = avatarId || storedAvatar?.avatarId;
  const effectiveCustomImage = customImage || storedAvatar?.customImage;
  
  return (
    <Avatar className={sizeClasses[size]}>
      {effectiveCustomImage ? (
        <AvatarImage src={effectiveCustomImage} alt={username || "User"} />
      ) : effectiveAvatarId && avatars[effectiveAvatarId - 1] ? (
        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
          {avatars[effectiveAvatarId - 1].svg}
        </div>
      ) : (
        <>
          <AvatarFallback className="bg-primary/10 text-primary">
            {userInitial}
          </AvatarFallback>
        </>
      )}
    </Avatar>
  );
}
