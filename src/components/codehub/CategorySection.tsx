
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface CategoryItem {
  name: string;
  icon: string;
  status: 'busy' | 'active' | 'idle';
  members: number;
  description?: string;
  isUserMember?: boolean;
}

interface CategorySectionProps {
  title: string;
  items: CategoryItem[];
  onItemClick: (item: CategoryItem) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, items, onItemClick }) => {
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
      <h2 className="text-2xl font-semibold mb-5 text-gray-800">
        {title}
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item, index) => (
          <Card 
            key={index}
            onClick={() => onItemClick(item)}
            className={`transition-all duration-300 cursor-pointer hover:shadow-lg transform hover:-translate-y-1 bg-white border-gray-200 hover:border-purple-200 relative ${
              item.isUserMember ? 'ring-2 ring-green-500 border-green-200' : ''
            }`}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              {item.isUserMember && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              )}
              
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium mb-3 bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                {item.icon}
              </div>
              
              <h3 className="font-medium mb-1 text-gray-800">
                {item.name}
              </h3>
              
              {item.description && (
                <p className="text-xs mb-3 text-gray-600">
                  {item.description}
                </p>
              )}
              
              <div className="flex items-center mt-auto mb-2">
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getStatusColor(item.status)}`}></span>
                <Badge variant="secondary" className="text-xs font-normal gap-1.5">
                  {getStatusName(item.status)} • {item.members} {item.members === 1 ? 'member' : 'members'}
                </Badge>
              </div>
              
              {item.isUserMember && (
                <div className="mt-1 text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                  Joined
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
