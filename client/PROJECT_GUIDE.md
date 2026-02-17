# Taprobane - Sri Lankan Cultural Events & Destinations Guide

A modern React-based web application for exploring Sri Lankan cultural events and travel destinations with user reviews and admin management capabilities.

## 🌟 Features

### Public Features
- **Browse Destinations**: Explore curated travel destinations across Sri Lanka
- **Discover Events**: Find cultural events, festivals, and ceremonies
- **View Details**: Full-page image sliders with detailed information
- **Read Reviews**: Browse authentic community reviews with images

### User Features (Requires Login)
- **Write Reviews**: Rate and review events and destinations
- **Upload Images**: Share your experience with photos
- **Star Ratings**: Provide 1-5 star ratings
- **Social Media Style**: Reviews displayed like social media posts

### Admin Features
- **Manage Events**: Create, update, and delete cultural events
- **Manage Destinations**: Create, update, and delete destinations
- **Content Moderation**: Delete inappropriate reviews
- **Image Management**: Add multiple images for events and destinations

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.17.0 or higher recommended)
- Backend API running on `http://localhost:8080`

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Base URL**
   
   The API base URL is configured in `src/services/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://localhost:8080/api';
   ```
   
   Update this if your backend runs on a different port.

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Backend Requirements

Ensure your Spring Boot backend is running with the following endpoints:

- **Authentication**: `/api/auth/login`, `/api/auth/signup`
- **Events**: `/api/events` (GET, POST, PUT, DELETE)
- **Destinations**: `/api/destinations` (GET, POST, PUT, DELETE)
- **Event Reviews**: `/api/events/reviews` (GET, POST, PUT, DELETE)
- **Destination Reviews**: `/api/destinations/reviews` (GET, POST, PUT, DELETE)

See the attached markdown files for complete API documentation.

## 📱 Application Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Navigation header
│   │   └── Layout.tsx          # Main layout wrapper
│   ├── reviews/
│   │   ├── ReviewCard.tsx      # Social media style review card
│   │   └── ReviewForm.tsx      # Review submission form
│   ├── shared/
│   │   └── ImageSlider.tsx     # Full-page image gallery
│   ├── ui/                     # Shadcn UI components
│   └── ProtectedRoute.tsx      # Route protection
├── contexts/
│   └── AuthContext.tsx         # Authentication state
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── ManageEvents.tsx
│   │   └── ManageDestinations.tsx
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── events/
│   │   ├── Events.tsx
│   │   └── EventDetail.tsx
│   ├── destinations/
│   │   ├── Destinations.tsx
│   │   └── DestinationDetail.tsx
│   └── Home.tsx
├── services/
│   └── api.ts                  # API service layer
└── types/
    └── index.ts                # TypeScript interfaces
```

## 🎨 Key Pages

### Home (`/`)
- Hero section with call-to-action
- Feature highlights
- Quick navigation to events and destinations

### Events (`/events`)
- Grid view of all cultural events
- Event cards with images, dates, and locations
- Filter by upcoming events

### Event Detail (`/events/:id`)
- Full-page hero image
- Complete event information
- Image gallery slider
- Reviews section with rating system
- Review submission form (for logged-in users)

### Destinations (`/destinations`)
- Grid view of all destinations
- Destination cards with images and best visiting season
- Visual appeal with hover effects

### Destination Detail (`/destinations/:id`)
- Full-page hero image
- Detailed destination information
- Image gallery slider
- Reviews section
- Review submission form

### Admin Dashboard (`/admin`)
- Quick access to management pages
- Event and destination statistics
- Admin-only access

### Admin Management
- **Manage Events**: CRUD operations for events
- **Manage Destinations**: CRUD operations for destinations
- Form-based editing with image URL management
- Confirmation dialogs for deletions

## 🔐 Authentication

### User Registration
1. Navigate to `/signup`
2. Fill in personal information
3. Create account
4. Automatically logged in

### User Login
1. Navigate to `/login`
2. Enter username/email and password
3. Receive JWT token
4. Token stored in localStorage

### Admin Access
- Admin users have `ROLE_ADMIN` in their roles array
- Access to `/admin` routes
- Can delete any review
- Can manage all events and destinations

## 📝 Writing Reviews

1. **Login Required**: Users must be logged in
2. **Navigate to Event/Destination**: Click on any event or destination
3. **Click "Write a Review"**: Button appears if logged in
4. **Rate**: Select 1-5 stars
5. **Write Review**: Add detailed text review
6. **Add Images** (Optional): Paste image URLs (up to 5 images)
7. **Submit**: Review appears immediately

## 🖼️ Image Slider Features

- Full-screen display
- Keyboard navigation (Arrow keys, Escape)
- Thumbnail navigation
- Image counter
- Smooth transitions
- Mobile responsive

## 🎭 UI Components

Built with **shadcn/ui** and **Tailwind CSS**:
- Cards
- Buttons
- Dialogs
- Alert Dialogs
- Forms
- Inputs
- Textareas
- Avatars
- Badges
- Skeletons (loading states)
- Toast notifications

## 🔧 Configuration

### Environment Variables
Create a `.env` file if needed:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Then update `src/services/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

## 🚢 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

## 🎯 User Flows

### Visitor Flow
1. Land on homepage
2. Browse destinations or events
3. Click to view details
4. See full images in slider
5. Read community reviews
6. Sign up to contribute

### Logged-in User Flow
1. Login
2. Browse content
3. Click on event/destination
4. Write review with rating
5. Upload images (optional)
6. Submit review
7. See review appear instantly

### Admin Flow
1. Login as admin
2. Access admin dashboard
3. Manage events or destinations
4. Create new content
5. Edit existing content
6. Delete content
7. Moderate reviews

## 🎨 Design Highlights

- **Color Scheme**: Orange/Red gradient (Sri Lankan theme)
- **Typography**: Clean, modern fonts
- **Animations**: Smooth hover effects and transitions
- **Responsive**: Mobile-first design
- **Accessibility**: Keyboard navigation support
- **Loading States**: Skeleton screens for better UX

## 📦 Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Vite** - Build tool

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend is running on port 8080
- Check CORS configuration in backend
- Verify API endpoints match documentation

### Authentication Issues
- Clear localStorage if JWT expired
- Re-login to get fresh token
- Check token expiration (24 hours default)

### Image Loading Issues
- Ensure image URLs are accessible
- Use HTTPS URLs for production
- Check CORS on image servers

## 📚 Related Documentation

- `POSTMAN_TESTING_GUIDE.md` - Authentication API guide
- `EVENT_API_TESTING_GUIDE.md` - Events API documentation
- `DESTINATION_API_TESTING_GUIDE.md` - Destinations API documentation
- `REVIEWS_API_TESTING_GUIDE.md` - Reviews API documentation

## 🤝 Contributing

When adding new features:
1. Follow existing code structure
2. Use TypeScript types
3. Maintain responsive design
4. Add loading states
5. Handle error cases
6. Test authentication flows

## 📄 License

This project is part of the Sri Lankan cultural heritage initiative.

---

**Built with ❤️ for Sri Lankan tourism and cultural preservation**
