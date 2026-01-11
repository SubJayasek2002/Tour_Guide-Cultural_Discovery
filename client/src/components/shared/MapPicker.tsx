import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
  readonly latitude?: number;
  readonly longitude?: number;
  readonly onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ position, onPositionChange }: { 
  position: [number, number] | null; 
  onPositionChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ latitude, longitude, onLocationSelect }: MapPickerProps) {
  // Default to Sri Lanka (Colombo)
  const defaultCenter: [number, number] = [6.9271, 79.8612];
  const [position, setPosition] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null
  );
  const [center, setCenter] = useState<[number, number]>(
    latitude && longitude ? [latitude, longitude] : defaultCenter
  );
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
      setCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const handlePositionChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  const handleClearLocation = () => {
    setPosition(null);
    onLocationSelect(0, 0);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setPosition([lat, lng]);
          setCenter([lat, lng]);
          onLocationSelect(lat, lng);
          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 13);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please select manually on the map.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Select Location on Map</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUseCurrentLocation}
          >
            Use Current Location
          </Button>
          {position && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearLocation}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-300 h-[400px]">
        <MapContainer
          center={center}
          zoom={8}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} onPositionChange={handlePositionChange} />
        </MapContainer>
      </div>

      {position && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <p className="font-medium mb-1">Selected Coordinates:</p>
          <p>Latitude: <span className="font-mono">{position[0].toFixed(6)}</span></p>
          <p>Longitude: <span className="font-mono">{position[1].toFixed(6)}</span></p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Click anywhere on the map to select a location. You can also use the "Use Current Location" button to automatically detect your position.
      </p>
    </div>
  );
}
