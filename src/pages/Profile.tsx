
import React from "react";
import Navbar from "@/components/Navbar";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
            Your Profile
          </span>
          <h1 className="text-4xl font-bold mt-6 mb-4 text-gray-900">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your preferences and explore your activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600">Name</label>
                <input 
                  type="text" 
                  className="border rounded-lg p-2"
                  placeholder="Enter your name"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input 
                  type="email" 
                  className="border rounded-lg p-2"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4">AI Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Enable AI Suggestions</span>
                <input type="checkbox" className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Personalized Learning</span>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
