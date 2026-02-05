import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Star, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-orange-600 via-red-600 to-orange-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070')] bg-cover bg-center opacity-20" />
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover
              <br />
              <span className="text-amber-200">Taprobane</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              Explore the rich cultural heritage and breathtaking destinations of Sri Lanka
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link to="/destinations">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Destinations
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Gateway to Sri Lankan Culture
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover ancient temples, pristine beaches, vibrant festivals, and everything
              that makes Sri Lanka special
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-12 pb-8">
                <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Curated Destinations
                </h3>
                <p className="text-gray-600">
                  Explore handpicked destinations from UNESCO World Heritage Sites to hidden gems
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-12 pb-8">
                <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Cultural Events
                </h3>
                <p className="text-gray-600">
                  Stay updated with traditional festivals, ceremonies, and cultural celebrations
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-12 pb-8">
                <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Community Reviews
                </h3>
                <p className="text-gray-600">
                  Read authentic reviews and share your own experiences with fellow travelers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community to share your experiences, rate destinations, and help others
            discover the beauty of Sri Lanka
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/signup">
                Get Started
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/destinations">
                Browse Destinations
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Taprobane</span>
              </div>
              <p className="text-gray-400">
                Your trusted guide to Sri Lankan cultural heritage and travel destinations
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/destinations" className="hover:text-orange-400 transition-colors">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="hover:text-orange-400 transition-colors">
                    Events
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/login" className="hover:text-orange-400 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-orange-400 transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Taprobane. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
