import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '@/services/api';
import type { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MapPin, Clock, Search, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapSearchOpen, setIsMapSearchOpen] = useState(false);
  const [searchLat, setSearchLat] = useState<number | null>(DEFAULT_CENTER[0]);
  const [searchLng, setSearchLng] = useState<number | null>(DEFAULT_CENTER[1]);
  const [radiusKm, setRadiusKm] = useState(25);
  const [hasLocationFilter, setHasLocationFilter] = useState(false);
  const [filteredByLocation, setFilteredByLocation] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsAPI.getAll();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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
    const filtered = events.filter((event) => {
      if (!event.latitude || !event.longitude) return false;
      const distance = getDistance(lat, lng, event.latitude, event.longitude);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Filter events based on search query and location
  const filteredEvents = useMemo(() => {
    let results = hasLocationFilter ? filteredByLocation : events;
    const query = searchQuery.toLowerCase();
    return results.filter((event) =>
      event.title.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query)
    );
  }, [events, searchQuery, hasLocationFilter, filteredByLocation]);

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
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
          Cultural Events
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover and experience the vibrant cultural heritage of Sri Lanka through festivals,
          ceremonies, and celebrations
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-2xl mx-auto flex gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search events by title or description..."
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
              <DialogTitle>Search Events by Location</DialogTitle>
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
                  className="bg-orange-600 hover:bg-orange-700"
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
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4 mr-2" /> Clear Filters
          </Button>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No events found matching your search' : 'No events available at the moment'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`}>
              <Card className="group h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  {event.imageUrls && event.imageUrls.length > 0 ? (
                    <img
                      src={event.imageUrls[0]}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
                      <Calendar className="h-16 w-16 text-orange-300" />
                    </div>
                  )}
                  {event.start && (
                    <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg">
                      <p className="text-xs text-gray-600 font-medium">
                        {formatDate(event.start)}
                      </p>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>

                  <div className="space-y-2">
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}

                    {event.start && event.end && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2 text-orange-500" />
                        <span>
                          {formatTime(event.start)} - {formatTime(event.end)}
                        </span>
                      </div>
                    )}
                  </div>

                  {event.imageUrls && event.imageUrls.length > 1 && (
                    <Badge variant="secondary" className="mt-4">
                      {event.imageUrls.length} photos
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
