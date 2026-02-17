import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Star, X, ImagePlus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { usersAPI } from '../../services/api';
import { toast } from 'sonner';

interface ReviewFormProps {
  onSubmit: (data: { rate: number; review: string; imageUrls: string[] }) => Promise<void>;
  initialData?: {
    rate: number;
    review: string;
    imageUrls?: string[];
  };
  submitLabel?: string;
}

export default function ReviewForm({ onSubmit, initialData, submitLabel = 'Submit Review' }: ReviewFormProps) {
  const [rating, setRating] = useState(initialData?.rate || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(initialData?.review || '');
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imageUrls || []);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef<string[]>([]);
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      previewUrlsRef.current = [];
    };
  }, []);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = 5 - imageUrls.length;
    if (remaining <= 0) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);
    setUploading(true);

    for (const file of filesToUpload) {
      // Show local preview immediately
      const tempUrl = URL.createObjectURL(file);
      previewUrlsRef.current.push(tempUrl);
      setLocalPreviews((p) => [...p, tempUrl]);

      if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
        toast.error(`${file.name} is not a supported image type (JPEG/PNG/WebP)`);
        setLocalPreviews((p) => p.filter((u) => u !== tempUrl));
        previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== tempUrl);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        setLocalPreviews((p) => p.filter((u) => u !== tempUrl));
        previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== tempUrl);
        continue;
      }

      try {
        const res = await usersAPI.uploadProfileImage(file);
        if (res?.imageUrl) {
          setImageUrls((prev) => [...prev, res.imageUrl]);
          setLocalPreviews((p) => p.filter((u) => u !== tempUrl));
          previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== tempUrl);
        }
      } catch (err: any) {
        console.error('Upload failed for', file.name, err);
        toast.error(`Failed to upload ${file.name}`);
        setLocalPreviews((p) => p.filter((u) => u !== tempUrl));
        previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== tempUrl);
      }
    }

    setUploading(false);
    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      setError('Please write a review');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        rate: rating,
        review: reviewText.trim(),
        imageUrls: imageUrls,
      });

      // Reset form if this is not editing
      if (!initialData) {
        setRating(0);
        setReviewText('');
        setImageUrls([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const allPreviews = [...imageUrls, ...localPreviews];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-orange-500 text-orange-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  {rating} {rating === 1 ? 'star' : 'stars'}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <Textarea
              id="review"
              placeholder="Share your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos (Optional)
            </label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleFilesSelected(e.target.files)}
            />

            {/* Image Previews + Upload Button */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {/* Existing uploaded images */}
              {allPreviews.map((url, index) => {
                const isLocalPreview = index >= imageUrls.length;
                return (
                  <div key={url + index} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200">
                    <img
                      src={url}
                      alt={`Review image ${index + 1}`}
                      className={`w-full h-full object-cover ${isLocalPreview ? 'opacity-50' : ''}`}
                    />
                    {isLocalPreview && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
                      </div>
                    )}
                    {!isLocalPreview && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Add image button */}
              {imageUrls.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50 flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-gray-400" />
                  )}
                  <span className="text-[10px] text-gray-400 font-medium">
                    {uploading ? 'Uploading...' : 'Add Photo'}
                  </span>
                </button>
              )}
            </div>

            {imageUrls.length < 5 && (
              <p className="text-xs text-gray-500 mt-2">
                Upload up to {5 - imageUrls.length} more {5 - imageUrls.length === 1 ? 'image' : 'images'} (JPEG, PNG, WebP — max 5MB each)
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading || uploading}>
            {loading ? 'Submitting...' : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
