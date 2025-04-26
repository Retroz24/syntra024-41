
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import UserAvatar from "../UserAvatar"; 

interface MiniProfileProps {
  username?: string;
}

const MiniProfile: React.FC<MiniProfileProps> = ({ username: propUsername }) => {
  const [username, setUsername] = useState<string>("Guest");

  useEffect(() => {
    // Use provided username or get from localStorage
    if (propUsername) {
      setUsername(propUsername);
    } else {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [propUsername]);

  return (
    <div className="flex flex-col items-center bg-card p-4 rounded-lg shadow-sm">
      <div className="mb-3">
        <UserAvatar username={username} size="lg" />
      </div>
      <h3 className="text-lg font-bold mb-1">{username}</h3>
      <p className="text-sm text-muted-foreground mb-3">Online</p>
      
      <div className="flex gap-2 mt-2">
        <Button asChild size="sm" variant="outline">
          <Link to="/profile">Profile</Link>
        </Button>
        <Button asChild size="sm">
          <Link to="/avatar">Edit Avatar</Link>
        </Button>
      </div>
    </div>
  );
};

export default MiniProfile;
