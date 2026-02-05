import { useEffect, useState } from 'react';
import { hotelsAPI } from '@/services/api';
import type { Hotel } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Building, X, CheckCircle, XCircle } from 'lucide-react';
import MapPicker from '@/components/shared/MapPicker';

export default function ManageHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [deleteHotelId, setDeleteHotelId] = useState<string | null>(null);
  const [paidToggleHotel, setPaidToggleHotel] = useState<Hotel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phones: [] as string[],
    whatsapp: '',
    email: '',
    website: '',
    amenities: [] as string[],
    imageUrls: [] as string[],
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const data = await hotelsAPI.getAllForAdmin();
      setHotels(data);
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    }
  };

  const handleOpenForm = (hotel?: Hotel) => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormData({
        name: hotel.name,
        description: hotel.description,
        address: hotel.address,
        phones: hotel.phones || [],
        whatsapp: hotel.whatsapp || '',
        email: hotel.email || '',
        website: hotel.website || '',
        amenities: hotel.amenities || [],
        imageUrls: hotel.imageUrls || [],
        latitude: hotel.latitude,
        longitude: hotel.longitude,
      });
    } else {
      setEditingHotel(null);
      setFormData({
        name: '',
        description: '',
        address: '',
        phones: [],
        whatsapp: '',
        email: '',
        website: '',
        amenities: [],
        imageUrls: [],
        latitude: undefined,
        longitude: undefined,
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHotel(null);
    setNewImageUrl('');
    setNewPhone('');
    setNewAmenity('');
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleAddPhone = () => {
    if (newPhone.trim()) {
      setFormData((prev) => ({
        ...prev,
        phones: [...prev.phones, newPhone.trim()],
      }));
      setNewPhone('');
    }
  };

  const handleRemovePhone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index),
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      alert('Please select a location on the map');
      return;
    }

    const { latitude, longitude } = formData;

    try {
      if (editingHotel) {
        await hotelsAPI.update(editingHotel.id, formData);
      } else {
        await hotelsAPI.create({
          ...formData,
          latitude,
          longitude,
        });
      }
      await fetchHotels();
      handleCloseForm();
    } catch (error: any) {
      alert(error.message || 'Failed to save hotel');
    }
  };

  const handleDelete = async () => {
    if (!deleteHotelId) return;

    try {
      await hotelsAPI.delete(deleteHotelId);
      await fetchHotels();
      setDeleteHotelId(null);
    } catch (error: any) {
      alert(error.message || 'Failed to delete hotel');
    }
  };

  const handleTogglePaid = async () => {
    if (!paidToggleHotel) return;

    try {
      await hotelsAPI.setPaid(paidToggleHotel.id);
      await fetchHotels();
      setPaidToggleHotel(null);
    } catch (error: any) {
      alert(error.message || 'Failed to update paid status');
    }
  };

  const filteredHotels = hotels.filter((hotel) => {
    const query = searchQuery.toLowerCase();
    return (
      hotel.name.toLowerCase().includes(query) ||
      hotel.description?.toLowerCase().includes(query) ||
      hotel.address?.toLowerCase().includes(query) ||
      hotel.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Hotels</h1>
          <p className="text-gray-600 mt-1">Create and manage hotel listings</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Hotel
        </Button>
      </div>

      <div className="mb-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search hotels by name, description, address, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-base"
          />
        </div>
      </div>

      {/* Hotels Table */}
      {filteredHotels.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery ? 'No hotels match your search.' : 'No hotels yet. Create your first hotel!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Amenities</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-center">Paid Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHotels.map((hotel) => (
                <TableRow key={hotel.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {hotel.imageUrls && hotel.imageUrls.length > 0 ? (
                        <img
                          src={hotel.imageUrls[0]}
                          alt={hotel.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-orange-100 flex items-center justify-center">
                          <Building className="h-6 w-6 text-orange-600" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate">{hotel.name}</div>
                        <div className="text-sm text-gray-500 truncate">{hotel.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm max-w-xs truncate">{hotel.address}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm max-w-xs">
                      {hotel.phones && hotel.phones.length > 0 && (
                        <div className="text-gray-700">{hotel.phones[0]}</div>
                      )}
                      {hotel.email && <div className="text-gray-500 truncate">{hotel.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {hotel.amenities?.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {hotel.amenities && hotel.amenities.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{hotel.amenities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {new Date(hotel.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPaidToggleHotel(hotel)}
                      className={hotel.isPaid ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}
                    >
                      {hotel.isPaid ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenForm(hotel)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteHotelId(hotel.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingHotel ? 'Edit Hotel' : 'Create New Hotel'}</DialogTitle>
            <DialogDescription>
              {editingHotel ? 'Update hotel details' : 'Add a new hotel listing'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Hotel Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  placeholder="+94771234567"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Phone Numbers</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  type="tel"
                  placeholder="+94771234567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={handleAddPhone}>
                  Add
                </Button>
              </div>
              {formData.phones.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.phones.map((phone) => (
                    <Badge key={phone} variant="secondary" className="pl-3 pr-1">
                      {phone}
                      <button
                        type="button"
                        onClick={() => handleRemovePhone(formData.phones.indexOf(phone))}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Amenities</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="e.g., WiFi, Pool, Parking"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={handleAddAmenity}>
                  Add
                </Button>
              </div>
              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="pl-3 pr-1">
                      {amenity}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(formData.amenities.indexOf(amenity))}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Location (Click on map) *</Label>
              <MapPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationSelect={(lat, lng) => {
                  setFormData({ ...formData, latitude: lat, longitude: lng });
                }}
              />
              {formData.latitude && formData.longitude && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </p>
              )}
            </div>

            <div>
              <Label>Images</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  type="url"
                  placeholder="Enter image URL"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={handleAddImage}>
                  Add
                </Button>
              </div>

              {formData.imageUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {formData.imageUrls.map((url) => (
                    <div key={url} className="relative aspect-square rounded overflow-hidden group">
                      <img src={url} alt="Hotel" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(formData.imageUrls.indexOf(url))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingHotel ? 'Update Hotel' : 'Create Hotel'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteHotelId} onOpenChange={() => setDeleteHotelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hotel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hotel? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Paid Toggle Confirmation */}
      <AlertDialog open={!!paidToggleHotel} onOpenChange={() => setPaidToggleHotel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {paidToggleHotel?.isPaid ? 'Hotel Already Paid' : 'Mark Hotel as Paid'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {paidToggleHotel?.isPaid ? (
                <>This hotel is already marked as paid and is visible to users.</>
              ) : (
                <>
                  Are you sure you want to mark <strong>{paidToggleHotel?.name}</strong> as paid? 
                  This will make it visible to all users.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {!paidToggleHotel?.isPaid && (
              <AlertDialogAction onClick={handleTogglePaid} className="bg-green-600 hover:bg-green-700">
                Mark as Paid
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
