
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import ProfileUpload from "@/components/ProfileUpload";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { Settings, User, Bell, Shield } from "lucide-react";

const Profile = () => {
  const { userProfile, updateUserProfile } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: userProfile.displayName,
    email: "",
    username: userProfile.username,
    avatarUrl: userProfile.avatarUrl,
    preferences: {
      aiSuggestions: true,
      personalizedLearning: true,
      notifications: true,
      privateProfile: false
    }
  });

  const handleProfileUpdate = () => {
    updateUserProfile({
      displayName: formData.name,
      username: formData.username,
      avatarUrl: formData.avatarUrl
    });
    
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully",
    });
  };

  const handleImageUpdate = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, avatarUrl: imageUrl }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mt-6 mb-4 text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card className="p-8 md:col-span-2 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-6 mb-8">
              <ProfileUpload
                currentImage={formData.avatarUrl}
                username={formData.username}
                onImageUpdate={handleImageUpdate}
              />
              <div>
                <h2 className="text-2xl font-semibold dark:text-white">Personal Information</h2>
                <p className="text-gray-500 dark:text-gray-400">Update your photo and personal details</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                    className="dark:bg-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username"
                    className="dark:bg-gray-700"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="dark:bg-gray-700"
                />
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-medium mb-4 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>AI Suggestions</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive personalized code suggestions
                    </p>
                  </div>
                  <Switch
                    checked={formData.preferences.aiSuggestions}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, aiSuggestions: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Personalized Learning</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Adapt content to your style
                    </p>
                  </div>
                  <Switch
                    checked={formData.preferences.personalizedLearning}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, personalizedLearning: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-medium mb-4 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Private Profile</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Only show profile to connections
                    </p>
                  </div>
                  <Switch
                    checked={formData.preferences.privateProfile}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, privateProfile: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button onClick={handleProfileUpdate} size="lg">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
