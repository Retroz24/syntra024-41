
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SimpleAuth from "@/components/auth/SimpleAuth";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png')] bg-cover bg-center opacity-5"></div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Next-Gen AI Development Platform
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Build the
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600 ml-3">
                Future
              </span>
              <br />
              with <span className="text-orange-500">Syntra</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Where artificial intelligence meets human creativity. 
              Design, code, and collaborate in ways never before possible.
            </p>
          </div>

          {/* Quick Auth Section */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 pt-8">
            <div className="w-full max-w-sm">
              <SimpleAuth variant="compact" />
            </div>
            
            <div className="text-gray-400">or</div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/ai-playground">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Code className="w-5 h-5 mr-2" />
                  Try AI Playground
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link to="/codehub">
                <Button variant="outline" size="lg" className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-full font-semibold transition-all duration-300">
                  Explore CodeHub
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Code className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">AI-Powered Development</h3>
              <p className="text-gray-600 text-sm">Smart code generation and real-time assistance</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Collaborative Workspace</h3>
              <p className="text-gray-600 text-sm">Work together in real-time chat rooms</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <ArrowRight className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Instant Deployment</h3>
              <p className="text-gray-600 text-sm">Deploy your projects with one click</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
