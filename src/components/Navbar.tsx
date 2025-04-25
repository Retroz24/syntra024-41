
import { Link } from 'react-router-dom';
import { Home, Play, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/a0743b79-faca-44ef-b81c-9ac71f0333fc.png" 
              alt="Syntra Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-black">Syntra</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link to="/playground" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
              <Play className="w-5 h-5" />
              <span>Playground</span>
            </Link>
            <Link to="/ai-playground" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
              <span>AI Playground</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
