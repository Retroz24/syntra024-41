
import { Link } from 'react-router-dom';
import { Home, User, Lock, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, []);

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="fixed w-full z-50 top-4">
      <nav className="max-w-6xl mx-auto px-4">
        <div className="bg-white/70 backdrop-blur-md rounded-full shadow-lg border border-white/20">
          <div className="flex justify-between items-center h-14 px-6">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/a0743b79-faca-44ef-b81c-9ac71f0333fc.png" 
                  alt="Syntra Logo" 
                  className="h-7 w-auto"
                />
                <span className="text-lg font-bold text-black">Syntra</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-1.5 text-gray-700 hover:text-gray-900 transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              <Link to="/ai-playground" className="flex items-center space-x-1.5 text-gray-700 hover:text-gray-900 transition-colors">
                <span>AI Playground</span>
              </Link>
              
              {user && (
                <Link to="/codehub" className="flex items-center space-x-1.5 text-gray-700 hover:text-gray-900 transition-colors">
                  <Lock className="w-4 h-4" />
                  <span>CodeHub</span>
                </Link>
              )}
              
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center space-x-1.5 text-gray-700 hover:text-gray-900 transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="rounded-full p-0 w-8 h-8">
                        <Avatar className="h-8 w-8">
                          {profile?.avatar_url ? (
                            <AvatarImage src={profile.avatar_url} alt={profile.full_name || user.email || ""} />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile">Profile Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/avatar">Edit Avatar</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} className="text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full p-0 w-8 h-8">
                      <Avatar className="h-8 w-8">
                        {profile?.avatar_url ? (
                          <AvatarImage src={profile.avatar_url} alt={profile.full_name || user.email || ""} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/">Home</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/ai-playground">AI Playground</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/codehub">CodeHub</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
