import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Hotel, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  MessageCircle, 
  Image, 
  Sparkles, 
  X, 
  Plus,
  CreditCard,
  Building
} from 'lucide-react';
import { hotelsAPI, usersAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Fix default marker icons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(delete (L.Icon.Default.prototype as any)._getIconUrl);
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DEFAULT_CENTER: [number, number] = [6.9271, 79.8612]; // Colombo
const REGISTRATION_FEE = 5000; // LKR

// Map click handler component
function MapClickHandler({ onLocationPick }: { onLocationPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface HotelFormData {
  name: string;
  description: string;
  address: string;
  phones: string[];
  whatsapp: string;
  email: string;
  website: string;
  amenities: string[];
  imageUrls: string[];
  latitude: number | null;
  longitude: number | null;
}

const AMENITY_OPTIONS = [
  'Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Bar',
  'Room Service', 'Parking', 'Airport Shuttle', 'Air Conditioning',
  'Beach Access', 'Pet Friendly', 'Business Center', 'Laundry Service',
  'Kids Club', '24/7 Reception', 'Conference Room', 'Garden'
];

const HotelRegistration = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);
  const previewUrlsRef = useRef<string[]>([]);
  
  const [formData, setFormData] = useState<HotelFormData>({
    name: '',
    description: '',
    address: '',
    phones: [],
    whatsapp: '',
    email: '',
    website: '',
    amenities: [],
    imageUrls: [],
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to register your hotel');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: keyof HotelFormData, value: string | string[] | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationPick = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const addPhone = () => {
    if (newPhone.trim() && !formData.phones.includes(newPhone.trim())) {
      setFormData(prev => ({ ...prev, phones: [...prev.phones, newPhone.trim()] }));
      setNewPhone('');
    }
  };

  const removePhone = (phone: string) => {
    setFormData(prev => ({ ...prev, phones: prev.phones.filter(p => p !== phone) }));
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !formData.imageUrls.includes(newImageUrl.trim())) {
      setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, newImageUrl.trim()] }));
      setNewImageUrl('');
    }
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const tempUrl = URL.createObjectURL(file);
        previewUrlsRef.current.push(tempUrl);
        setLocalPreviews((p) => [...p, tempUrl]);
        if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
          toast.error(`${file.name} is not a supported image type (JPEG/PNG) and was skipped.`);
          setLocalPreviews((p) => p.filter((u) => u !== tempUrl));
          previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== tempUrl);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 5MB and was skipped.`);
          setLocalPreviews((p) => p.filter((u) => u !== tempUrl));
          previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== tempUrl);
          continue;
        }
        try {
          const res = await usersAPI.uploadProfileImage(file);
          if (res?.imageUrl) {
            setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, res.imageUrl] }));
            setLocalPreviews((p) => p.filter((u) => u !== tempUrl));
            previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== tempUrl);
          }
        } catch (err: any) {
          console.error('Upload failed for', file.name, err);
          toast.error(`Failed to upload ${file.name}`);
          setLocalPreviews((p) => p.filter((u) => u !== tempUrl));
          previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== tempUrl);
        }
      }
    } finally {
      setUploadingImages(false);
    }
  };

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      previewUrlsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeImageUrl = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrls: prev.imageUrls.filter(u => u !== url) }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Hotel name is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (!formData.address.trim()) {
      toast.error('Address is required');
      return false;
    }
    if (formData.latitude === null || formData.longitude === null) {
      toast.error('Please select a location on the map');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create the hotel first
      const hotelData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        phones: formData.phones.length > 0 ? formData.phones : undefined,
        whatsapp: formData.whatsapp || undefined,
        email: formData.email || undefined,
        website: formData.website || undefined,
        amenities: formData.amenities.length > 0 ? formData.amenities : undefined,
        imageUrls: formData.imageUrls.length > 0 ? formData.imageUrls : undefined,
        latitude: formData.latitude!,
        longitude: formData.longitude!,
      };

      const createdHotel = await hotelsAPI.create(hotelData);
      toast.success('Hotel registered successfully! Please complete the payment to make it visible.');
      
      // Navigate to payment page with hotel details
      navigate('/hotels/payment', { 
        state: { 
          hotelId: createdHotel.id,
          hotelName: formData.name,
          amount: REGISTRATION_FEE,
          userEmail: user?.email,
          userName: user?.username
        } 
      });
    } catch (error) {
      console.error('Failed to register hotel:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to register hotel');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Building className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Register Your Hotel</h1>
        </div>
        <p className="text-gray-600">
          List your hotel on Sri Ceylon and reach thousands of travelers. Complete the form below and make a one-time payment to activate your listing.
        </p>
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-orange-600" />
          <span className="text-orange-800">
            Registration fee: <strong>LKR {REGISTRATION_FEE.toLocaleString()}</strong> (one-time payment)
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5 text-orange-600" />
              Basic Information
            </CardTitle>
            <CardDescription>Enter the essential details about your hotel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hotel Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Grand Colombo Hotel"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your hotel, its unique features, and what makes it special..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="e.g., 123 Galle Road, Colombo 03"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Location on Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              Location on Map *
            </CardTitle>
            <CardDescription>Click on the map to set your hotel's exact location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-80 rounded-lg overflow-hidden border">
              <MapContainer
                center={formData.latitude && formData.longitude 
                  ? [formData.latitude, formData.longitude] 
                  : DEFAULT_CENTER}
                zoom={12}
                scrollWheelZoom
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onLocationPick={handleLocationPick} />
                {formData.latitude && formData.longitude && (
                  <Marker position={[formData.latitude, formData.longitude]} />
                )}
              </MapContainer>
            </div>
            {formData.latitude && formData.longitude ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                <MapPin className="h-4 w-4" />
                <span>
                  Location set: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                <MapPin className="h-4 w-4" />
                <span>Click on the map to set your hotel's location</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-orange-600" />
              Contact Information
            </CardTitle>
            <CardDescription>How can customers reach you?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Phone Numbers */}
            <div className="space-y-2">
              <Label>Phone Numbers</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., +94 77 123 4567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPhone();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addPhone}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.phones.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.phones.map((phone) => (
                    <Badge key={phone} variant="secondary" className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {phone}
                      <button type="button" onClick={() => removePhone(phone)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-600" />
                WhatsApp Number
              </Label>
              <Input
                id="whatsapp"
                placeholder="e.g., 94771234567 (without + or spaces)"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., info@yourhotel.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-600" />
                Website URL
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="e.g., https://www.yourhotel.com"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-600" />
              Amenities
            </CardTitle>
            <CardDescription>Select the amenities your hotel offers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => (
                <Badge
                  key={amenity}
                  variant={formData.amenities.includes(amenity) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-colors ${
                    formData.amenities.includes(amenity)
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'hover:bg-orange-50'
                  }`}
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-orange-600" />
              Hotel Images
            </CardTitle>
            <CardDescription>Add image URLs to showcase your hotel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Paste image URL here..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addImageUrl}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border rounded-md bg-white text-sm">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFilesSelected(e.target.files)}
                    className="hidden"
                  />
                  Upload from device
                </label>
                {uploadingImages && <div className="text-sm text-gray-500">Uploading...</div>}
              </div>
            </div>
            {formData.imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.imageUrls.map((url) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      alt={`Hotel preview`}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+URL';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(url)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {localPreviews.length > 0 && (
              <div className="mt-3">
                <div className="text-sm text-gray-600 mb-2">Preview(s)</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {localPreviews.map((p) => (
                    <div key={p} className="relative group rounded overflow-hidden border bg-gray-50 flex items-center justify-center">
                      <img src={p} alt="preview" className="w-full h-32 object-cover" />
                      <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">Uploading...</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/hotels')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin" aria-hidden="true">⏳</span>
                <span>Registering...</span>
              </span>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Register & Proceed to Payment
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HotelRegistration;