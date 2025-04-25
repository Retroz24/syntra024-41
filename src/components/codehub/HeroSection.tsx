
import * as React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onCreateRoom: () => void;
  onJoinByCode: () => void;
  onRandomMatch: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onCreateRoom,
  onJoinByCode,
  onRandomMatch
}) => {
  const { isDarkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${isDarkMode ? 'bg-gray-900/70' : 'bg-white/80'} backdrop-blur-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg p-8 md:p-10`}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10">
        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Welcome to CodeHub
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"> – Dive Into Dev Study Circles</span>
        </h1>
        
        <p className={`text-lg max-w-3xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Join or create real-time dev rooms based on your tech stack. Connect with other developers, share knowledge, and grow together.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <form onSubmit={handleSearch} className="relative w-full md:max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for a language, stack, or interest"
              className={`pl-10 w-full py-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-end">
            <Button 
              onClick={onCreateRoom}
              className={`${isDarkMode ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'} text-white px-4 py-2 h-auto`}
            >
              Create Room
            </Button>
            <Button 
              onClick={onJoinByCode}
              variant="outline" 
              className={`${isDarkMode ? 'border-purple-500 text-purple-400' : 'border-purple-500 text-purple-700'} px-4 py-2 h-auto`}
            >
              Join by Code
            </Button>
            <Button 
              onClick={onRandomMatch}
              variant="outline" 
              className={`${isDarkMode ? 'border-blue-500 text-blue-400' : 'border-blue-500 text-blue-700'} px-4 py-2 h-auto`}
            >
              Random Match
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
