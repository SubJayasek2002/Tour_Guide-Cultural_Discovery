import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, eventReviewsAPI } from '@/services/api';
import type { Event, Review } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, ArrowLeft, Image as ImageIcon, Star } from 'lucide-react';
import ImageSlider from '@/components/shared/ImageSlider';
import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewForm from '@/components/reviews/ReviewForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImageSlider, setShowImageSlider] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [eventData, reviewsData] = await Promise.all([
          eventsAPI.getById(id),
          eventReviewsAPI.getByEventId(id),
        ]);
        setEvent(eventData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleReviewSubmit = async (data: { rate: number; review: string; imageUrls: string[] }) => {
    if (!id) return;

    await eventReviewsAPI.create({
      eventId: id,
      ...data,
    });

    // Refresh reviews
    const updatedReviews = await eventReviewsAPI.getByEventId(id);
    setReviews(updatedReviews);
    setShowReviewForm(false);
  };

  const handleDeleteReview = async (reviewId: string) => {
    await eventReviewsAPI.delete(reviewId);
    setReviews(reviews.filter((r) => r.id !== reviewId));
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rate, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full rounded-lg mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Event not found</p>
        <Button onClick={() => navigate('/events')} className="mt-4">
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Section */}
      <div className="relative h-[60vh] bg-gray-900">
        {event.imageUrls && event.imageUrls.length > 0 ? (
          <>
            <img
              src={event.imageUrls[0]}
              alt={event.title}
              className="w-full h-full object-cover opacity-80"
            />
            {event.imageUrls.length > 1 && (
              <Button
                variant="secondary"
                className="absolute bottom-6 right-6"
                onClick={() => setShowImageSlider(true)}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                View All {event.imageUrls.length} Photos
              </Button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-900 to-red-900">
            <Calendar className="h-32 w-32 text-white/20" />
          </div>
        )}

        {/* Back Button */}
        <Button
          variant="secondary"
          className="absolute top-6 left-6"
          onClick={() => navigate('/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title and Rating */}
          <div className="bg-white rounded-lg shadow-md p-8 -mt-20 relative z-10 mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{event.title}</h1>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(averageRating)
                          ? 'fill-orange-500 text-orange-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-gray-500">({reviews.length} reviews)</span>
              </div>
            )}

            {/* Event Details */}
            <div className="space-y-3 text-gray-600">
              {event.start && (
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(event.start)}</p>
                    {event.end && (
                      <p className="text-sm">
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {event.location && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p>{event.location}</p>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Reviews ({reviews.length})
              </h2>
              {user && !showReviewForm && (
                <Button onClick={() => setShowReviewForm(true)}>
                  Write a Review
                </Button>
              )}
              {!user && (
                <Button onClick={() => navigate('/login')}>
                  Sign in to Review
                </Button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && user && (
              <div className="mb-8">
                <ReviewForm
                  onSubmit={handleReviewSubmit}
                  submitLabel="Post Review"
                />
                <Button
                  variant="ghost"
                  onClick={() => setShowReviewForm(false)}
                  className="mt-4"
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    currentUserId={user?.id}
                    isAdmin={isAdmin}
                    onDelete={handleDeleteReview}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Slider */}
      {showImageSlider && event.imageUrls && event.imageUrls.length > 0 && (
        <ImageSlider
          images={event.imageUrls}
          title={event.title}
          onClose={() => setShowImageSlider(false)}
        />
      )}
    </div>
  );
}
