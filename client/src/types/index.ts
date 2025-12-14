export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  start?: string;
  end?: string;
  location: string;
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
