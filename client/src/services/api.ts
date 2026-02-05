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
