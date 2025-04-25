
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProfileUpload from "@/components/ProfileUpload";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const Profile = () => {
  const [profileData, setProfileData] = useLocalStorage("userProfile", {
    name: "",
    email: "",
    username: "DevUser",
    avatarUrl: "",
    preferences: {
      aiSuggestions: true,
      personalizedLearning: true,
    }
  });
  
  const { toast } = useToast();

  const handleProfileUpdate = () => {
    // Save to localStorage happens automatically via useLocalStorage hook
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully",
    });
  };

  const handleImageUpdate = (imageUrl: string) => {
    setProfileData(prev => ({ ...prev, avatarUrl: imageUrl }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <span className="px-4 py-2 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full text-sm font-medium">
            Your Profile
          </span>
          <h1 className="text-4xl font-bold mt-6 mb-4 text-gray-900 dark:text-white">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Manage your preferences and explore your activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <Card className="p-8 bg-white dark:bg-gray-800">
            <div className="flex flex-col items-center mb-6">
              <ProfileUpload
                currentImage={profileData.avatarUrl}
                username={profileData.username}
                onImageUpdate={handleImageUpdate}
              />
              <h2 className="text-2xl font-semibold mt-4 dark:text-white">Profile Information</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your username"
                  className="dark:bg-gray-700"
                />
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">AI Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable AI Suggestions</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive personalized AI-powered code suggestions
                  </p>
                </div>
                <Switch
                  checked={profileData.preferences.aiSuggestions}
                  onCheckedChange={(checked) => 
                    setProfileData(prev => ({
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
                    Adapt content based on your learning style
                  </p>
                </div>
                <Switch
                  checked={profileData.preferences.personalizedLearning}
                  onCheckedChange={(checked) => 
                    setProfileData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, personalizedLearning: checked }
                    }))
                  }
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-center mt-8">
          <Button onClick={handleProfileUpdate} className="px-8">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
