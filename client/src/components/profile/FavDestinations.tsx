import { useEffect, useState } from "react";
import { favoritesAPI, destinationsAPI } from "../../services/api";
import type { Favorite, Destination } from "../../types/index";

const FavoriteDestinations = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  // Load favorites and destinations
  useEffect(() => {
    loadFavorites();
    loadDestinations();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const res = await favoritesAPI.getFavoriteDestinations();
      setFavorites(res || []); // Handle case where API returns array directly
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDestinations = async () => {
    try {
      const res = await destinationsAPI.getAll();
      setDestinations(res || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Toggle favorite destination
  const toggleFavorite = async (destinationId: string, isFavorite: boolean) => {
    try {
      setUpdating(prev => ({ ...prev, [destinationId]: true }));
      
      if (isFavorite) {
        // Remove from favorites
        await favoritesAPI.removeFavoriteDestination(destinationId);
        setFavorites(prev => prev.filter(f => f.destination?.id !== destinationId));
      } else {
        // Add to favorites
        const result = await favoritesAPI.addFavoriteDestination(destinationId);
        setFavorites(prev => [result, ...prev]);
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(prev => ({ ...prev, [destinationId]: false }));
    }
  };

  // Filter destinations for search
  const filteredDestinations = destinations.filter(dest =>
    dest.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && favorites.length === 0) {
    return <div className="text-center p-8">Loading favorites...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Favorite Destinations</h3>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Favorite Destinations List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">My Favorites ({favorites.length})</h4>
          {favorites.length === 0 && (
            <p className="text-gray-500 text-sm">No favorite destinations yet. Start adding some!</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((favorite) => {
            const destination = favorite.destination;
            const isUpdating = updating[destination?.id || ""];

            return (
              <div key={favorite.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-bold text-lg line-clamp-1">{destination?.title}</h5>
                  <button
                    onClick={() => toggleFavorite(destination?.id || "", true)}
                    disabled={isUpdating}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    {isUpdating ? "..." : "Remove"}
                  </button>
                </div>
                
                <p className="text-gray-600 mb-2 line-clamp-2">{destination?.description}</p>
                <p className="text-sm text-gray-500 mb-3">{destination?.location}</p>
                
                {destination?.imageUrls?.[0] && (
                  <img
                    src={destination.imageUrls[0]}
                    alt={destination.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add More Destinations Section */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Add More Destinations</h4>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search destinations to add..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredDestinations.map((destination) => {
            const isFavorite = favorites.some(f => f.destination?.id === destination.id);
            const isUpdating = updating[destination.id || ""];

            return (
              <div key={destination.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-bold text-lg line-clamp-1">{destination.title}</h5>
                  <button
                    onClick={() => toggleFavorite(destination.id, isFavorite)}
                    disabled={isUpdating}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      isFavorite
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    } disabled:opacity-50`}
                  >
                    {isUpdating ? "..." : isFavorite ? "Remove" : "Add"}
                  </button>
                </div>
                
                <p className="text-gray-600 mb-2 line-clamp-2">{destination.description}</p>
                <p className="text-sm text-gray-500 mb-3">{destination.location}</p>
                
                {destination.imageUrls?.[0] && (
                  <img
                    src={destination.imageUrls[0]}
                    alt={destination.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FavoriteDestinations;
