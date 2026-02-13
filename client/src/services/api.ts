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

// ... [Existing Auth, Users, Events, Hotels, Destinations, Reviews APIs remain unchanged] ...

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
};

// Events API
export const eventsAPI = {
  getAll: () => apiRequest('/events'),
  getById: (id: string) => apiRequest(`/events/${id}`),
  create: (eventData: any) =>
    apiRequest('/events', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    }),
  update: (id: string, eventData: any) =>
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
  create: (hotelData: any) =>
    apiRequest('/hotels', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(hotelData),
    }),
  update: (id: string, hotelData: any) =>
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

export const getHotelsByOwner = hotelsAPI.getByOwner;
export const deleteHotel = hotelsAPI.delete;

// Destinations API
export const destinationsAPI = {
  getAll: () => apiRequest('/destinations'),
  getById: (id: string) => apiRequest(`/destinations/${id}`),
  create: (destinationData: any) =>
    apiRequest('/destinations', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(destinationData),
    }),
  update: (id: string, destinationData: any) =>
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
  create: (reviewData: any) =>
    apiRequest('/events/reviews', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    }),
  update: (reviewId: string, reviewData: any) =>
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
  create: (reviewData: any) =>
    apiRequest('/destinations/reviews', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    }),
  update: (reviewId: string, reviewData: any) =>
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

// Chat API
export const chatAPI = {
  sendMessage: async (message: string) => {
    const res = await fetch(`${API_BASE_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || 'Request failed');
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return res.json();
    }

    return res.text();
  },
};

// ==========================================
// NEW APIS ADDED BELOW
// ==========================================

// User Profile API
export const profileAPI = {
  // Get current user's full profile details
  getProfile: () =>
    apiRequest('/users/profile/me', {
      headers: getAuthHeaders(),
    }),

  // Update current user's profile
  updateProfile: (profileData: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    bio?: string;
    avatarUrl?: string;
  }) =>
    apiRequest('/users/profile/me', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    }),

  // Change password
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest('/users/profile/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }),
};

// Favorites API (Destinations & Events)
export const favoritesAPI = {
  // --- Destinations ---
  getFavoriteDestinations: () =>
    apiRequest('/favorites/destinations', {
      headers: getAuthHeaders(),
    }),

  addFavoriteDestination: (destinationId: string) =>
    apiRequest(`/favorites/destinations/${destinationId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }),

  removeFavoriteDestination: (destinationId: string) =>
    apiRequest(`/favorites/destinations/${destinationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),

  // --- Events ---
  getFavoriteEvents: () =>
    apiRequest('/favorites/events', {
      headers: getAuthHeaders(),
    }),

  addFavoriteEvent: (eventId: string) =>
    apiRequest(`/favorites/events/${eventId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }),

  removeFavoriteEvent: (eventId: string) =>
    apiRequest(`/favorites/events/${eventId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),
};

// My Reviews API (Reviews written by the current user)
export const myReviewsAPI = {
  // Get all reviews written by the current user
  getAll: () =>
    apiRequest('/reviews/my-reviews', {
      headers: getAuthHeaders(),
    }),

  // Get a specific review by ID (ensure it belongs to the user)
  getById: (reviewId: string) =>
    apiRequest(`/reviews/my-reviews/${reviewId}`, {
      headers: getAuthHeaders(),
    }),

  // Update a review owned by the user
  update: (reviewId: string, reviewData: { rate?: number; review?: string; imageUrls?: string[] }) =>
    apiRequest(`/reviews/my-reviews/${reviewId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    }),

  // Delete a review owned by the user
  delete: (reviewId: string) =>
    apiRequest(`/reviews/my-reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),
};