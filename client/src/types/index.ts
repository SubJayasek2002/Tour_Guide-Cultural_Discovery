export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  start?: string;
  end?: string;
  location: string;
  latitude?: number; // Geographic coordinate for map integration
  longitude?: number; // Geographic coordinate for map integration
  timestamp: string;
  createdById: string;
  createdByUsername: string;
}

export interface Destination {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  bestSeasonToVisit?: string;
  location: string;
  latitude?: number; // Geographic coordinate for map integration
  longitude?: number; // Geographic coordinate for map integration
  timestamp: string;
  createdById: string;
  createdByUsername: string;
}

export interface Review {
  id: string;
  eventId?: string;
  eventTitle?: string;
  destinationId?: string;
  destinationTitle?: string;
  userId: string;
  username: string;
  rate: number;
  review: string;
  imageUrls?: string[];
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImageUrl?: string;
  roles: string[];
  enabled: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Hotel {
  id: string;
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
  isPaid: boolean;
  createdAt: string;
  createdById?: string;
  createdByUsername?: string;
}