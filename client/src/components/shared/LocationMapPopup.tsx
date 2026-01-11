import { MapContainer, TileLayer, Marker, Popup as LeafletPopup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MapPin } from 'lucide-react';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapPopupProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly title: string;
  readonly location: string;
}

export default function LocationMapPopup({
  isOpen,
  onClose,
  latitude,
  longitude,
  title,
  location,
}: LocationMapPopupProps) {
  const hasCoordinates = latitude !== undefined && longitude !== undefined && latitude !== 0 && longitude !== 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Location Map</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>

        {hasCoordinates ? (
          <div className="flex-1 rounded-lg overflow-hidden border border-gray-300 min-h-[600px]">
            <MapContainer
              center={[latitude, longitude]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[latitude, longitude]}>
                <LeafletPopup>
                  <div>
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <p className="text-xs text-gray-600">{location}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {latitude.toFixed(4)}, {longitude.toFixed(4)}
                    </p>
                  </div>
                </LeafletPopup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
            <MapPin className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500">Location coordinates not available</p>
            {location && <p className="text-gray-600 text-sm mt-2">{location}</p>}
          </div>
        )}

        {hasCoordinates && (
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">Latitude:</span>{' '}
              <span className="font-mono">{latitude.toFixed(6)}</span>
            </p>
            <p className="text-gray-700 mt-1">
              <span className="font-semibold">Longitude:</span>{' '}
              <span className="font-mono">{longitude.toFixed(6)}</span>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
