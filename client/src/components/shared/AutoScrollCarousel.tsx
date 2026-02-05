import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AutoScrollCarouselProps {
  images: string[];
  autoScrollInterval?: number;
  className?: string;
  aspectRatio?: string;
}

export default function AutoScrollCarousel({
  images,
  autoScrollInterval = 5000,
  className = '',
  aspectRatio = 'aspect-[16/9]',
}: AutoScrollCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    if (!isHovering && images.length > 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, autoScrollInterval);
    }

    return () => {
      resetTimeout();
    };
  }, [currentIndex, isHovering, images.length, autoScrollInterval]);

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`${aspectRatio} bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-emerald-600">No images available</p>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={`${aspectRatio} relative rounded-lg overflow-hidden ${className}`}>
        <img
          src={images[0]}
          alt="Single image"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-lg overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Image Container */}
      <div className={`${aspectRatio} relative`}>
        <div className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full h-full flex-shrink-0">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white shadow-lg"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white shadow-lg"
        onClick={goToNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
