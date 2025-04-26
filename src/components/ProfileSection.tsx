
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserAvatar from "./UserAvatar";

interface ProfileSectionProps {
  username: string;
}

export function ProfileSection({ username }: ProfileSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col items-center">
            <UserAvatar username={username} size="lg" />
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
