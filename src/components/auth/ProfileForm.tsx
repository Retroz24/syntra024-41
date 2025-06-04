
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound } from 'lucide-react';

export default function ProfileForm() {
  const { profile, updateProfile, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    avatar_url: profile?.avatar_url || '',
    bio: profile?.bio || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            {formData.avatar_url ? (
              <AvatarImage src={formData.avatar_url} alt={formData.full_name} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {getInitials(formData.full_name)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <CardTitle className="text-2xl text-center">Your Profile</CardTitle>
        <CardDescription className="text-center">
          Update your personal information
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="full_name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your name"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="avatar_url" className="text-sm font-medium">
              Avatar URL
            </label>
            <Input
              id="avatar_url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://example.com/your-avatar.jpg"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows={3}
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
