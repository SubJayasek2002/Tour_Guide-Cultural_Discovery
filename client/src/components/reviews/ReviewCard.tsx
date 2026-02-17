import { useState } from 'react';
import type { Review } from '@/types';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Star, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import ImageSlider from '../shared/ImageSlider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  isAdmin?: boolean;
  onDelete?: (reviewId: string) => void;
}

export default function ReviewCard({ review, currentUserId, isAdmin, onDelete }: ReviewCardProps) {
  const [showImageSlider, setShowImageSlider] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const canDelete = currentUserId === review.userId || isAdmin;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(review.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                {review.userProfileImageUrl ? (
                  <AvatarImage src={review.userProfileImageUrl} alt={review.username} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white font-semibold">
                  {review.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">{review.username}</p>
                <p className="text-xs text-gray-500">{formatDate(review.timestamp)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Star Rating */}
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rate
                        ? 'fill-orange-500 text-orange-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Delete Button */}
              {canDelete && onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-600"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Review Text */}
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{review.review}</p>

          {/* Images */}
          {review.imageUrls && review.imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {review.imageUrls.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setShowImageSlider(true)}
                  className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Slider */}
      {showImageSlider && review.imageUrls && review.imageUrls.length > 0 && (
        <ImageSlider
          images={review.imageUrls}
          title={`${review.username}'s review`}
          onClose={() => setShowImageSlider(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
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
    </>
  );
}
