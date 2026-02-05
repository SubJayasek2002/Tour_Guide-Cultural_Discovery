import { Link } from 'react-router-dom';
import { MapPin, Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Sri Ceylon
              </span>
            </div>
            <p className="text-emerald-100 leading-relaxed">
              Your trusted companion for discovering Sri Lanka's cultural heritage, pristine beaches, lush forests, and unforgettable travel experiences.
            </p>
            <div className="flex space-x-3 mt-6">
              <a 
                href="#" 
                className="h-9 w-9 rounded-full bg-emerald-800 hover:bg-emerald-700 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="h-9 w-9 rounded-full bg-emerald-800 hover:bg-emerald-700 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="h-9 w-9 rounded-full bg-emerald-800 hover:bg-emerald-700 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-emerald-300">Explore</h3>
            <ul className="space-y-3 text-emerald-100">
              <li>
                <Link to="/destinations" className="hover:text-teal-300 transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mr-2 group-hover:w-2 transition-all"></span>
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-teal-300 transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mr-2 group-hover:w-2 transition-all"></span>
                  Cultural Events
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="hover:text-teal-300 transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mr-2 group-hover:w-2 transition-all"></span>
                  Accommodations
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-emerald-300">Account</h3>
            <ul className="space-y-3 text-emerald-100">
              <li>
                <Link to="/login" className="hover:text-teal-300 transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mr-2 group-hover:w-2 transition-all"></span>
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-teal-300 transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mr-2 group-hover:w-2 transition-all"></span>
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/hotels/register" className="hover:text-teal-300 transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mr-2 group-hover:w-2 transition-all"></span>
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-emerald-300">Contact Us</h3>
            <ul className="space-y-3 text-emerald-100">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-0.5 text-emerald-400 flex-shrink-0" />
                <span>info@sriceylon.lk</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-0.5 text-emerald-400 flex-shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-emerald-400 flex-shrink-0" />
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-emerald-200 text-sm">
              &copy; {new Date().getFullYear()} Sri Ceylon. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-emerald-200">
              <a href="#" className="hover:text-teal-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-teal-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-teal-300 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
