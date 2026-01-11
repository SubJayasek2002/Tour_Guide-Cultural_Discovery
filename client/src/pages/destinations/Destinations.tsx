import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { destinationsAPI } from '@/services/api';
import type { Destination } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Sun, Image, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationsAPI.getAll();
        setDestinations(data);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Filter destinations based on search query
  const filteredDestinations = destinations.filter((destination) => {
    const query = searchQuery.toLowerCase();
    return (
      destination.title.toLowerCase().includes(query) ||
      destination.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
          Travel Destinations
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore the breathtaking beauty and rich cultural heritage of Sri Lanka's most
          iconic destinations
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search destinations by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-base"
          />
        </div>
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No destinations found matching your search' : 'No destinations available at the moment'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <Link key={destination.id} to={`/destinations/${destination.id}`}>
              <Card className="group h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  {destination.imageUrls && destination.imageUrls.length > 0 ? (
                    <img
                      src={destination.imageUrls[0]}
                      alt={destination.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
                      <MapPin className="h-16 w-16 text-orange-300" />
                    </div>
                  )}
                  {destination.imageUrls && destination.imageUrls.length > 1 && (
                    <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg flex items-center space-x-1">
                      <Image className="h-4 w-4 text-gray-600" />
                      <span className="text-xs text-gray-600 font-medium">
                        {destination.imageUrls.length}
                      </span>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {destination.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {destination.description}
                  </p>

                  <div className="space-y-2">
                    {destination.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                        <span className="line-clamp-1">{destination.location}</span>
                      </div>
                    )}

                    {destination.bestSeasonToVisit && (
                      <div className="flex items-start text-sm text-gray-500">
                        <Sun className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" />
                        <span className="line-clamp-2">{destination.bestSeasonToVisit}</span>
                      </div>
                    )}
                  </div>

                  <Badge
                    variant="secondary"
                    className="mt-4 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700"
                  >
                    Explore
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
