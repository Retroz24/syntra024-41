
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserAvatar from "./UserAvatar";
import { useAuth } from "@/contexts/AuthContext";

export function ProfileSection() {
  const { profile, user } = useAuth();
  
  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>Please sign in to view your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const username = profile?.full_name || user.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url;
  const avatarId = Number(localStorage.getItem('userAvatar') ? 
    JSON.parse(localStorage.getItem('userAvatar') || '{}').avatarId : null);
  const customImage = profile?.avatar_url || (localStorage.getItem('userAvatar') ? 
    JSON.parse(localStorage.getItem('userAvatar') || '{}').customImage : null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col items-center">
            <UserAvatar 
              username={username} 
              size="lg" 
              avatarId={avatarId} 
              customImage={avatarUrl || customImage} 
            />
            <Button asChild variant="link" className="mt-2">
              <Link to="/avatar">Change Avatar</Link>
            </Button>
          </div>
          
          <div className="flex-1 space-y-2">
            <div>
              <label className="text-sm font-medium">Username</label>
              <p className="text-xl font-bold">{username}</p>
            </div>
            
            <div className="pt-4">
              <Button asChild>
                <Link to="/profile">Edit Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
