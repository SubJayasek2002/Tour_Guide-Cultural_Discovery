import { useEffect, useState } from 'react';
import { destinationsAPI } from '@/services/api';
import type { Destination } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, X, MapPin, Search } from 'lucide-react';
import MapPicker from '@/components/shared/MapPicker';
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

export default function ManageDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [deleteDestinationId, setDeleteDestinationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    bestSeasonToVisit: '',
    imageUrls: [] as string[],
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, []);

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

  const handleOpenForm = (destination?: Destination) => {
    if (destination) {
      setEditingDestination(destination);
      setFormData({
        title: destination.title,
        description: destination.description,
        location: destination.location,
        latitude: destination.latitude,
        longitude: destination.longitude,
        bestSeasonToVisit: destination.bestSeasonToVisit || '',
        imageUrls: destination.imageUrls || [],
      });
    } else {
      setEditingDestination(null);
      setFormData({
        title: '',
        description: '',
        location: '',
        latitude: undefined,
        longitude: undefined,
        bestSeasonToVisit: '',
        imageUrls: [],
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDestination(null);
    setNewImageUrl('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingDestination) {
        await destinationsAPI.update(editingDestination.id, formData);
      } else {
        await destinationsAPI.create(formData);
      }
      await fetchDestinations();
      handleCloseForm();
    } catch (error: any) {
      alert(error.message || 'Failed to save destination');
    }
  };

  const handleDelete = async () => {
    if (!deleteDestinationId) return;

    try {
      await destinationsAPI.delete(deleteDestinationId);
      await fetchDestinations();
      setDeleteDestinationId(null);
    } catch (error: any) {
      alert(error.message || 'Failed to delete destination');
    }
  };

  const filteredDestinations = destinations.filter((destination) => {
    const query = searchQuery.toLowerCase();
    return (
      destination.title.toLowerCase().includes(query) ||
      destination.description?.toLowerCase().includes(query) ||
      destination.location?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Destinations</h1>
          <p className="text-gray-600 mt-1">Create and manage travel destinations</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Destination
        </Button>
      </div>

      <div className="mb-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search destinations by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-base"
          />
        </div>
      </div>

      {/* Destinations List */}
      {filteredDestinations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery
                ? 'No destinations match your search.'
                : 'No destinations yet. Create your first destination!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <Card key={destination.id}>
              <div className="relative h-48 bg-gray-200">
                {destination.imageUrls && destination.imageUrls.length > 0 ? (
                  <img
                    src={destination.imageUrls[0]}
                    alt={destination.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-amber-100">
                    <MapPin className="h-12 w-12 text-teal-300" />
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{destination.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{destination.description}</p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenForm(destination)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteDestinationId(destination.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDestination ? 'Edit Destination' : 'Create New Destination'}
            </DialogTitle>
            <DialogDescription>
              {editingDestination ? 'Update destination details' : 'Add a new travel destination'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div>
              <MapPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationSelect={(lat, lng) => {
                  setFormData({ ...formData, latitude: lat, longitude: lng });
                }}
              />
            </div>

            <div>
              <Label htmlFor="bestSeasonToVisit">Best Season to Visit</Label>
              <Input
                id="bestSeasonToVisit"
                value={formData.bestSeasonToVisit}
                onChange={(e) => setFormData({ ...formData, bestSeasonToVisit: e.target.value })}
                placeholder="e.g., December to April"
              />
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
                <div className="grid grid-cols-3 gap-2">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded overflow-hidden group">
                      <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingDestination ? 'Update Destination' : 'Create Destination'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDestinationId} onOpenChange={() => setDeleteDestinationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Destination</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this destination? This action cannot be undone.
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
    </div>
  );
}
