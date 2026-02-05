import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-slate-800 via-teal-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1705365291453-7962869cae67?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2lnaXJpeWElMjByb2NrfGVufDB8fDB8fHww')] bg-cover bg-center opacity-40" />
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover
              <br />
              <span className="text-amber-400 font-bold">Taprobane</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Explore the rich cultural heritage and breathtaking destinations of Sri Lanka
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-slate-800 hover:bg-gray-100 font-semibold">
                <Link to="/destinations">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Destinations
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-2 border-white hover:bg-white/10">
                <Link to="/events">
                  <Calendar className="mr-2 h-5 w-5" />
                  View Events
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-left mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Features Section
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <Card className="text-left hover:shadow-lg transition-shadow border-4 border-teal-600 bg-amber-50 hover:shadow-teal-600/50">
              <CardContent className="pt-8 pb-8">
                <div className="h-16 w-16 bg-teal-700 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">
                  Cultural Destinations
                </h3>
                <p className="text-slate-700">
                  Explore handpicked destinations from UNESCO World Heritage Sites to hidden gems
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="text-left hover:shadow-lg transition-shadow border-4 border-teal-600 bg-amber-50 hover:shadow-teal-600/50">
              <CardContent className="pt-8 pb-8">
                <div className="h-16 w-16 bg-teal-700 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">
                  Cultural Events
                </h3>
                <p className="text-slate-700">
                  Stay updated with traditional festivals, ceremonies, and cultural celebrations
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="text-left hover:shadow-lg transition-shadow border-4 border-teal-600 bg-amber-50 hover:shadow-teal-600/50">
              <CardContent className="pt-8 pb-8">
                <div className="h-16 w-16 bg-teal-700 rounded-full flex items-center justify-center mb-6">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">
                  Community Reviews
                </h3>
                <p className="text-slate-700">
                  Read authentic reviews and share your own experiences with fellow travelers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-100 via-amber-50 to-teal-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-slate-700 mb-8 max-w-2xl mx-auto">
            Join our community to share your experiences, rate destinations, and help others
            discover the beauty of Sri Lanka
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-teal-600 text-white hover:bg-teal-700 font-semibold">
              <Link to="/signup">
                Get Started
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-teal-600 border-2 border-teal-600 hover:bg-teal-50">
              <Link to="/destinations">
                Browse Destinations
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Taprobane</span>
              </div>
              <p className="text-teal-100">
                Your trusted guide to Sri Lankan cultural heritage and travel destinations
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-teal-100">
                <li>
                  <Link to="/destinations" className="hover:text-teal-300 transition-colors">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="hover:text-teal-300 transition-colors">
                    Events
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-teal-100">
                <li>
                  <Link to="/login" className="hover:text-teal-300 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-teal-300 transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-teal-800 pt-8 text-center text-teal-100">
            <p>&copy; 2024 Taprobane. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}