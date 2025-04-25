
import { Link } from 'react-router-dom';
import { Home, User } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="fixed w-full z-50 top-4">
      <nav className="max-w-6xl mx-auto px-4">
        <div className="bg-white/70 backdrop-blur-md rounded-full shadow-lg border border-white/20">
          <div className="flex justify-between items-center h-14 px-6">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/a0743b79-faca-44ef-b81c-9ac71f0333fc.png" 
                alt="Syntra Logo" 
                className="h-7 w-auto"
              />
              <span className="text-lg font-bold text-black">Syntra</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-1.5 text-gray-700 hover:text-gray-900 transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link to="/ai-playground" className="flex items-center space-x-1.5 text-gray-700 hover:text-gray-900 transition-colors">
                <span>AI Playground</span>
              </Link>
              <Link to="/profile" className="flex items-center space-x-1.5 text-gray-700 hover:text-gray-900 transition-colors">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </div>
            {/* Mobile menu button - you can expand this later if needed */}
            <button className="md:hidden flex items-center">
              <User className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
