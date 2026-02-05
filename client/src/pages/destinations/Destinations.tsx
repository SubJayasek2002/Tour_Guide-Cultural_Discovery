import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { destinationsAPI } from '@/services/api';
import type { Destination } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Sun, Image, Search, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Footer from '@/components/shared/Footer';
import AutoScrollCarousel from '@/components/shared/AutoScrollCarousel';

// Fix default marker icons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(delete (L.Icon.Default.prototype as any)._getIconUrl);
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DEFAULT_CENTER: [number, number] = [6.9271, 79.8612]; // Colombo

function MapPicker({ onLocationPick }: { onLocationPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapSearchOpen, setIsMapSearchOpen] = useState(false);
  const [searchLat, setSearchLat] = useState<number | null>(DEFAULT_CENTER[0]);
  const [searchLng, setSearchLng] = useState<number | null>(DEFAULT_CENTER[1]);
  const [radiusKm, setRadiusKm] = useState(25);
  const [hasLocationFilter, setHasLocationFilter] = useState(false);
  const [filteredByLocation, setFilteredByLocation] = useState<Destination[]>([]);

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

  const handleLocationPick = (lat: number, lng: number) => {
    setSearchLat(lat);
    setSearchLng(lng);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSearchLat(latitude);
          setSearchLng(longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please check permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleMapSearch = (lat: number, lng: number, radius: number) => {
    const filtered = destinations.filter((destination) => {
      if (!destination.latitude || !destination.longitude) return false;
      const distance = getDistance(lat, lng, destination.latitude, destination.longitude);
      return distance <= radius;
    });
    setFilteredByLocation(filtered);
    setHasLocationFilter(true);
    setIsMapSearchOpen(false);
  };

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setHasLocationFilter(false);
    setFilteredByLocation([]);
  };

  // Filter destinations based on search query and location
  const filteredDestinations = useMemo(() => {
    let results = hasLocationFilter ? filteredByLocation : destinations;
    const query = searchQuery.toLowerCase();
    return results.filter((destination) =>
      destination.title.toLowerCase().includes(query) ||
      destination.description?.toLowerCase().includes(query) ||
      destination.location?.toLowerCase().includes(query)
    );
  }, [destinations, searchQuery, hasLocationFilter, filteredByLocation]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {new Array(6).fill(null).map(() => {
            const key = String(Math.random());
            return <Skeleton key={key} className="h-96 rounded-lg" />;
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50/20 to-white">
      <div className="flex-1 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-4">
            Travel Destinations
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the breathtaking beauty and rich cultural heritage of Sri Lanka's most
            iconic destinations
          </p>
        </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-2xl mx-auto flex gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search destinations by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-base"
          />
        </div>
        <Dialog open={isMapSearchOpen} onOpenChange={setIsMapSearchOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Map Search</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Search Destinations by Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border bg-white h-96">
                <MapContainer
                  center={[searchLat || DEFAULT_CENTER[0], searchLng || DEFAULT_CENTER[1]]}
                  zoom={12}
                  scrollWheelZoom
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapPicker onLocationPick={handleLocationPick} />
                  {searchLat && searchLng && (
                    <Marker position={[searchLat, searchLng]}>
                      <Popup>Search Location</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
              <div className="space-y-2">
                <Label>Radius (km)</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number.parseFloat(e.target.value) || 1)}
                />
                <p className="text-xs text-gray-500">Click on the map to pick a location, then set radius and search.</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={handleGetCurrentLocation}
                  className="mr-auto"
                >
                  <MapPin className="h-4 w-4 mr-2" /> Use Current Location
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsMapSearchOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  disabled={searchLat === null || searchLng === null}
                  onClick={() => {
                    if (searchLat !== null && searchLng !== null) {
                      handleMapSearch(searchLat, searchLng, radiusKm);
                    }
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
            {(searchQuery || hasLocationFilter) && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="text-gray-600 hover:text-gray-900 border-gray-300"
              >
                <X className="h-4 w-4 mr-2" /> Clear Filters
              </Button>
            )}
          </div>

          {/* Destinations Grid */}
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchQuery ? 'No destinations found matching your search' : 'No destinations available at the moment'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination) => (
                <Link key={destination.id} to={`/destinations/${destination.id}`}>
                  <Card className="group h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-emerald-100 hover:border-emerald-300 hover:-translate-y-1">
                    {/* Image Carousel */}
                    {destination.imageUrls && destination.imageUrls.length > 0 ? (
                      <AutoScrollCarousel 
                        images={destination.imageUrls} 
                        className="h-56"
                        aspectRatio="h-56"
                      />
                    ) : (
                      <div className="h-56 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
                        <MapPin className="h-16 w-16 text-emerald-300" />
                      </div>
                    )}

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {destination.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {destination.description}
                      </p>

                      <div className="space-y-2">
                        {destination.location && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                            <span className="line-clamp-1">{destination.location}</span>
                          </div>
                        )}

                        {destination.bestSeasonToVisit && (
                          <div className="flex items-start text-sm text-gray-500">
                            <Sun className="h-4 w-4 mr-2 mt-0.5 text-teal-500 flex-shrink-0" />
                            <span className="line-clamp-2">{destination.bestSeasonToVisit}</span>
                          </div>
                        )}
                      </div>

                      <Badge
                        variant="secondary"
                        className="mt-4 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700"
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
      <Footer />
    </div>
  );
}
