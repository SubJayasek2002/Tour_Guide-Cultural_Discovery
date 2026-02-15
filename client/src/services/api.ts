const API_BASE_URL = 'http://localhost:8081/api';

// Auth helpers
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic API request handler
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: (credentials: { usernameOrEmail: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  signup: (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    roles?: string[];
  }) =>
    apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getCurrentUser: () =>
    apiRequest('/users/me', {
      headers: getAuthHeaders(),
    }),
};

// Users API (Admin only)
export const usersAPI = {
  getAll: () =>
    apiRequest('/users', {
      headers: getAuthHeaders(),
    }),

  getById: (userId: string) =>
    apiRequest(`/users/${userId}`, {
      headers: getAuthHeaders(),
    }),

  toggleStatus: (userId: string) =>
    apiRequest(`/users/${userId}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    }),

  delete: (userId: string) =>
    apiRequest(`/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),
  // Favorites for authenticated user
  getMyFavoriteDestinations: () =>
    apiRequest('/users/me/favorites/destinations', { headers: getAuthHeaders() }),

  addMyFavoriteDestination: (destinationId: string) =>
    apiRequest(`/users/me/favorites/destinations/${destinationId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }),

  removeMyFavoriteDestination: (destinationId: string) =>
    apiRequest(`/users/me/favorites/destinations/${destinationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),

  getMyFavoriteEvents: () =>
    apiRequest('/users/me/favorites/events', { headers: getAuthHeaders() }),

  addMyFavoriteEvent: (eventId: string) =>
    apiRequest(`/users/me/favorites/events/${eventId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }),

  removeMyFavoriteEvent: (eventId: string) =>
    apiRequest(`/users/me/favorites/events/${eventId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),

  // Profile endpoints for authenticated user
  getMyProfile: () =>
    apiRequest('/users/me/profile', { headers: getAuthHeaders() }),

  updateMe: (data: { firstName?: string; lastName?: string; email?: string; phoneNumber?: string; profileImageUrl?: string }) =>
    apiRequest('/users/me', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }),

  uploadProfileImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/upload/profile-image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Upload failed');
    }
    return response.json();
  },

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest('/users/me/password', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }),
};

// Events API
export const eventsAPI = {
  getAll: () => apiRequest('/events'),

  getById: (id: string) => apiRequest(`/events/${id}`),

  create: (eventData: {
    title: string;
    description: string;
    imageUrls: string[];
    location: string;
    start?: string;
    end?: string;
  }) =>
    apiRequest('/events', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    }),

  update: (id: string, eventData: Partial<{
    title: string;
    description: string;
    imageUrls: string[];
    location: string;
    start?: string;
    end?: string;
  }>) =>
    apiRequest(`/events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    }),

  delete: (id: string) =>
    apiRequest(`/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),
};

// Hotels API
export const hotelsAPI = {
  getAll: () => apiRequest('/hotels'),

  getAllForAdmin: () =>
    apiRequest('/hotels/admin/all', {
      headers: getAuthHeaders(),
    }),

  getById: (id: string) => apiRequest(`/hotels/${id}`),

  getNearby: (lat: number, lng: number, radiusKm = 10) =>
    apiRequest(`/hotels/near?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`),

  getByOwner: (ownerId: string) =>
    apiRequest(`/hotels/owner/${ownerId}`, {
      headers: getAuthHeaders(),
    }),

  create: (hotelData: {
    name: string;
    description: string;
    address: string;
    phones?: string[];
    whatsapp?: string;
    email?: string;
    website?: string;
    amenities?: string[];
    imageUrls?: string[];
    latitude: number;
    longitude: number;
  }) =>
    apiRequest('/hotels', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(hotelData),
    }),

  update: (id: string, hotelData: Partial<{
    name: string;
    description: string;
    address: string;
    phones?: string[];
    whatsapp?: string;
    email?: string;
    website?: string;
    amenities?: string[];
    imageUrls?: string[];
    latitude?: number;
    longitude?: number;
    isPaid?: boolean;
  }>) =>
    apiRequest(`/hotels/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(hotelData),
    }),

  delete: (id: string) =>
    apiRequest(`/hotels/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),

  setPaid: (id: string) =>
    apiRequest(`/hotels/${id}/set-paid`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    }),
};

// For MyHotels page convenience
export const getHotelsByOwner = hotelsAPI.getByOwner;
export const deleteHotel = hotelsAPI.delete;

// Destinations API
export const destinationsAPI = {
  getAll: () => apiRequest('/destinations'),

  getById: (id: string) => apiRequest(`/destinations/${id}`),

  create: (destinationData: {
    title: string;
    description: string;
    imageUrls: string[];
    location: string;
    bestSeasonToVisit?: string;
  }) =>
    apiRequest('/destinations', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(destinationData),
    }),

  update: (id: string, destinationData: Partial<{
    title: string;
    description: string;
    imageUrls: string[];
    location: string;
    bestSeasonToVisit?: string;
  }>) =>
    apiRequest(`/destinations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(destinationData),
    }),

  delete: (id: string) =>
    apiRequest(`/destinations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),
};

// Event Reviews API
export const eventReviewsAPI = {
  getByEventId: (eventId: string) => apiRequest(`/events/reviews/event/${eventId}`),

  getById: (reviewId: string) => apiRequest(`/events/reviews/${reviewId}`),

  create: (reviewData: {
    eventId: string;
    rate: number;
    review: string;
    imageUrls?: string[];
  }) =>
    apiRequest('/events/reviews', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    }),

  update: (reviewId: string, reviewData: Partial<{
    rate: number;
    review: string;
    imageUrls?: string[];
  }>) =>
    apiRequest(`/events/reviews/${reviewId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    }),

  delete: (reviewId: string) =>
    apiRequest(`/events/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),
};

// Destination Reviews API
export const destinationReviewsAPI = {
  getByDestinationId: (destinationId: string) =>
    apiRequest(`/destinations/reviews/destination/${destinationId}`),

  getById: (reviewId: string) => apiRequest(`/destinations/reviews/${reviewId}`),

  create: (reviewData: {
    destinationId: string;
    rate: number;
    review: string;
    imageUrls?: string[];
  }) =>
    apiRequest('/destinations/reviews', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    }),

  update: (reviewId: string, reviewData: Partial<{
    rate: number;
    review: string;
    imageUrls?: string[];
  }>) =>
    apiRequest(`/destinations/reviews/${reviewId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    }),

  delete: (reviewId: string) =>
    apiRequest(`/destinations/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),
};

// Chat API (backend at /api/chat/send)
export const chatAPI = {
  sendMessage: async (message: string) => {
    const res = await fetch(`${API_BASE_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ message }),
    })

    if (!res.ok) {
      // Try JSON error, otherwise text
      const err = await res.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(err.message || 'Request failed')
    }

    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return res.json()
    }

    return res.text()
  },
}
