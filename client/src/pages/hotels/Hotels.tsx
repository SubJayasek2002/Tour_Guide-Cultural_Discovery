import { useEffect, useMemo, useState } from 'react';
import { hotelsAPI } from '@/services/api';
import type { Hotel } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Phone, Globe, Building, RefreshCw, Layers } from 'lucide-react';
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

export default function Hotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [radiusKm, setRadiusKm] = useState(10);
  const [searchLat, setSearchLat] = useState<number | null>(DEFAULT_CENTER[0]);
  const [searchLng, setSearchLng] = useState<number | null>(DEFAULT_CENTER[1]);
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchAllPaid = async () => {
    setLoading(true);
    try {
      const data = await hotelsAPI.getAll();
      setHotels(data);
      setCenter(DEFAULT_CENTER);
    } catch (err) {
      console.error('Failed to load hotels', err);
      alert('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const fetchNearby = async (lat: number, lng: number, radius: number) => {
    setLoading(true);
    try {
      const data = await hotelsAPI.getNearby(lat, lng, radius);
      setHotels(data);
      setCenter([lat, lng]);
    } catch (err) {
      console.error('Failed to load hotels', err);
      alert('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPaid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocationPick = (lat: number, lng: number) => {
    setSearchLat(lat);
    setSearchLng(lng);
  };

  const hotelsWithCoords = useMemo(
    () => hotels.filter((h) => h.latitude !== undefined && h.longitude !== undefined),
    [hotels]
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Hotels Nearby</h1>
          <p className="text-gray-600 mt-1">Search hotels by map radius. Payment flow coming soon.</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2 border rounded-lg p-1 bg-white">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              Map View
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Layers className="h-4 w-4 mr-2" /> Grid View
            </Button>
          </div>
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Search Hotels
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Search Hotels</DialogTitle>
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
                        <Popup>Selected Location</Popup>
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
                    onClick={() => setIsSearchOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-teal-600 hover:bg-teal-700"
                    disabled={loading || searchLat === null || searchLng === null}
                    onClick={() => {
                      if (searchLat !== null && searchLng !== null) {
                        fetchNearby(searchLat, searchLng, radiusKm);
                        setIsSearchOpen(false);
                      }
                    }}
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden border bg-white shadow-sm h-96">
            <MapContainer
              center={center}
              zoom={12}
              scrollWheelZoom
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {hotelsWithCoords.map((hotel) => (
                <Marker key={hotel.id} position={[hotel.latitude!, hotel.longitude!]}> 
                  <Popup>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm">{hotel.name}</h3>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {hotel.address}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {hotels.map((hotel) => (
              <Card key={hotel.id} className="border shadow-sm">
                {hotel.imageUrls && hotel.imageUrls.length > 0 ? (
                  <div className="h-40 w-full overflow-hidden">
                    <img src={hotel.imageUrls[0]} alt={hotel.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-40 w-full flex items-center justify-center bg-teal-50 text-teal-600">
                    <Building className="h-10 w-10" />
                  </div>
                )}
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{hotel.description}</p>
                    </div>
                    {!hotel.isPaid && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium whitespace-nowrap">
                        Not Visible
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-600" /> {hotel.address}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    {hotel.phones?.map((p, idx) => (
                      <a
                        key={idx}
                        href={`tel:${p}`}
                        className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" /> {p}
                      </a>
                    ))}
                    {hotel.whatsapp && (
                      <a
                        href={`https://wa.me/${hotel.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        WhatsApp
                      </a>
                    )}
                    {hotel.email && (
                      <a
                        href={`mailto:${hotel.email}`}
                        className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200"
                      >
                        {hotel.email}
                      </a>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities?.slice(0, 4).map((a) => (
                      <span key={a} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        {a}
                      </span>
                    ))}
                  </div>
                  {hotel.website && (
                    <Button
                      asChild
                      className="w-full mt-2 bg-white hover:bg-gray-100 text-teal-600 border border-teal-600"
                    >
                      <a href={hotel.website} target="_blank" rel="noreferrer">
                        <Globe className="h-4 w-4 mr-2" /> Visit Website
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            {hotels.length === 0 && (
              <div className="flex items-center justify-center gap-2 text-gray-500 p-6 border rounded-lg bg-white">
                <RefreshCw className="h-4 w-4" /> No hotels found for this area.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="border shadow-sm flex flex-col h-full">
              {hotel.imageUrls && hotel.imageUrls.length > 0 ? (
                <div className="h-48 w-full overflow-hidden">
                  <img src={hotel.imageUrls[0]} alt={hotel.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-48 w-full flex items-center justify-center bg-teal-50 text-teal-600">
                  <Building className="h-12 w-12" />
                </div>
              )}
              <CardContent className="space-y-2 p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{hotel.description}</p>
                  </div>
                  {!hotel.isPaid && (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium whitespace-nowrap">
                      Not Visible
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-teal-600 shrink-0" /> {hotel.address}
                </p>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities?.slice(0, 3).map((a) => (
                    <span key={a} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {a}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t mt-auto">
                  {hotel.phones?.map((p, idx) => (
                    <a
                      key={idx}
                      href={`tel:${p}`}
                      className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" /> {p}
                    </a>
                  ))}
                  {hotel.whatsapp && (
                    <a
                      href={`https://wa.me/${hotel.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      WhatsApp
                    </a>
                  )}
                  {hotel.email && (
                    <a
                      href={`mailto:${hotel.email}`}
                      className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200"
                    >
                      {hotel.email}
                    </a>
                  )}
                </div>
                {hotel.website && (
                  <Button
                    asChild
                    className="w-full mt-2 bg-white hover:bg-gray-100 text-teal-600 border border-teal-600"
                  >
                    <a href={hotel.website} target="_blank" rel="noreferrer">
                      <Globe className="h-4 w-4 mr-2" /> Visit Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {hotels.length === 0 && (
            <div className="flex items-center justify-center gap-2 text-gray-500 p-6 border rounded-lg bg-white col-span-full">
              <RefreshCw className="h-4 w-4" /> No hotels found. Use the search to find hotels nearby.
            </div>
          )}
        </div>
      )}
    </div>
  );
}