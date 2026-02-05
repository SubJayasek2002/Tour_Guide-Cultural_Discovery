import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MapPin, Calendar, User, LogOut, Shield, Hotel } from 'lucide-react';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Thaprobane
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/destinations"
              className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors flex items-center space-x-1 group"
            >
              <MapPin className="h-4 w-4 group-hover:text-emerald-600" />
              <span>Destinations</span>
            </Link>
            <Link
              to="/events"
              className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors flex items-center space-x-1 group"
            >
              <Calendar className="h-4 w-4 group-hover:text-teal-600" />
              <span>Events</span>
            </Link>
            <Link
              to="/hotels"
              className="text-sm font-medium text-gray-700 hover:text-cyan-600 transition-colors flex items-center space-x-1 group"
            >
              <Hotel className="h-4 w-4 group-hover:text-cyan-600" />
              <span>Hotels</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100"
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-emerald-50">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                      {user.firstName || user.username}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4 text-emerald-600" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="hover:bg-emerald-50 hover:text-emerald-700">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
