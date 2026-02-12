import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Star, Shield, Mountain, Waves, TreePine, Compass, Building, Award } from 'lucide-react';
import Footer from '@/components/shared/Footer';

export default function Home() {
  const heroImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2070',
    'https://images.unsplash.com/photo-1512934555127-12856310c17e?q=80&w=2070',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1705365291453-7962869cae67?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2lnaXJpeWElMjByb2NrfGVufDB8fDB8fHww')] bg-cover bg-center opacity-100 animate-ken-burns" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-4xl text-white">
            <div className="inline-block mb-4 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-300/30">
              <span className="text-emerald-100 text-sm font-medium">🌴 Discover Paradise on Earth</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              Explore
              <br />
              <span className="bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 bg-clip-text text-transparent">
                Sri Lanka
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-emerald-50 max-w-2xl leading-relaxed">
              Journey through ancient temples, pristine beaches, lush tea plantations, and vibrant cultural festivals in the Pearl of the Indian Ocean
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all">
                <Link to="/destinations">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Destinations
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                <Link to="/events">
                  <Calendar className="mr-2 h-5 w-5" />
                  Cultural Events
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                <Link to="/hotels">
                  <Building className="mr-2 h-5 w-5" />
                  Find Stays
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white via-emerald-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 rounded-full">
              <span className="text-emerald-700 text-sm font-semibold">WHY CHOOSE US</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Gateway to Sri Lankan Wonders
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From UNESCO World Heritage Sites to hidden tropical paradises, we help you discover 
              the authentic beauty and rich traditions of Sri Lanka
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-emerald-100 hover:border-emerald-300 bg-white hover:-translate-y-1">
              <CardContent className="pt-12 pb-8">
                <div className="h-16 w-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-emerald-300 group-hover:scale-110 transition-all">
                  <Mountain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-emerald-700 transition-colors">
                  Curated Destinations
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Explore handpicked destinations from ancient ruins to misty mountains, pristine waterfalls to golden beaches
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-emerald-100 hover:border-emerald-300 bg-white hover:-translate-y-1">
              <CardContent className="pt-12 pb-8">
                <div className="h-16 w-16 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-teal-300 group-hover:scale-110 transition-all">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-teal-700 transition-colors">
                  Cultural Celebrations
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience vibrant festivals, traditional ceremonies, and authentic cultural events throughout the year
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-emerald-100 hover:border-emerald-300 bg-white hover:-translate-y-1">
              <CardContent className="pt-12 pb-8">
                <div className="h-16 w-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-cyan-300 group-hover:scale-110 transition-all">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-cyan-700 transition-colors">
                  Authentic Reviews
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Read genuine experiences and share your own adventures with a community of passionate travelers
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-emerald-100 hover:border-emerald-300 bg-white hover:-translate-y-1">
              <CardContent className="pt-12 pb-8">
                <div className="h-16 w-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-emerald-300 group-hover:scale-110 transition-all">
                  <TreePine className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-emerald-700 transition-colors">
                  Eco-Friendly Travel
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Discover sustainable tourism options and help preserve Sri Lanka's natural beauty for future generations
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-emerald-100 hover:border-emerald-300 bg-white hover:-translate-y-1">
              <CardContent className="pt-12 pb-8">
                <div className="h-16 w-16 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-teal-300 group-hover:scale-110 transition-all">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-teal-700 transition-colors">
                  Quality Accommodations
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Find the perfect stay from luxury resorts to cozy guesthouses in stunning tropical locations
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-emerald-100 hover:border-emerald-300 bg-white hover:-translate-y-1">
              <CardContent className="pt-12 pb-8">
                <div className="h-16 w-16 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-cyan-300 group-hover:scale-110 transition-all">
                  <Compass className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-cyan-700 transition-colors">
                  Expert Guidance
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Get insider tips, detailed maps, and comprehensive guides to make the most of your journey
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512934555127-12856310c17e?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Sri Lanka at a Glance
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              A tropical paradise where ancient heritage meets natural wonders
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Award className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">8</div>
              <p className="text-emerald-200">UNESCO Sites</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Waves className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-teal-200 to-cyan-200 bg-clip-text text-transparent">1340km</div>
              <p className="text-teal-200">Coastline</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Mountain className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">500+</div>
              <p className="text-cyan-200">Waterfalls</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <TreePine className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-200 to-green-200 bg-clip-text text-transparent">26</div>
              <p className="text-emerald-200">National Parks</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Start Your
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Journey?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of travelers discovering the magic of Sri Lanka. Share your experiences, 
              find hidden gems, and create unforgettable memories.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all text-lg px-8">
                <Link to="/signup">
                  Get Started Free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-lg px-8">
                <Link to="/destinations">
                  Explore Destinations
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              No credit card required • Start exploring immediately
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
