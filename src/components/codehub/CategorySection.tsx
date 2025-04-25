
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface CategoryItem {
  name: string;
  icon: string;
  status: 'busy' | 'active' | 'idle';
  members: number;
  description?: string;
}

interface CategorySectionProps {
  title: string;
  items: CategoryItem[];
  onItemClick: (item: CategoryItem) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, items, onItemClick }) => {
  const { isDarkMode } = useDarkMode();
  
  const getStatusColor = (status: 'busy' | 'active' | 'idle') => {
    switch (status) {
      case 'busy': return 'bg-red-500';
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusName = (status: 'busy' | 'active' | 'idle') => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  return (
    <div className="mb-10">
      <h2 className={`text-2xl font-semibold mb-5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item, index) => (
          <Card 
            key={index}
            onClick={() => onItemClick(item)}
            className={`transition-all duration-300 cursor-pointer hover:shadow-md transform hover:-translate-y-1 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                : 'bg-white border-gray-200 hover:border-purple-200'
            }`}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium mb-3 bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                {item.icon}
              </div>
              
              <h3 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {item.name}
              </h3>
              
              {item.description && (
                <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
                </p>
              )}
              
              <div className="flex items-center mt-auto">
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getStatusColor(item.status)}`}></span>
                <Badge variant={isDarkMode ? "outline" : "secondary"} className="text-xs font-normal gap-1.5">
                  {getStatusName(item.status)} • {item.members} {item.members === 1 ? 'member' : 'members'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
