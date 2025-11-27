package com.tourguide.reviewservice.service;

import com.tourguide.reviewservice.dto.CreateReviewRequest;
import com.tourguide.reviewservice.dto.ReviewResponse;
import com.tourguide.reviewservice.dto.UpdateReviewRequest;
import com.tourguide.reviewservice.model.Review;
import com.tourguide.reviewservice.repository.ReviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Override
    public ReviewResponse createReview(CreateReviewRequest request, String currentUserId) {

        // Optional: check one review per user per destination
        reviewRepository.findByDestinationIdAndUserId(request.getDestinationId(), currentUserId)
                .ifPresent(existing -> {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "You have already submitted a review for this destination"
                    );
                });

        Review review = new Review();
        review.setDestinationId(request.getDestinationId());
        review.setUserId(currentUserId); // username from security context
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setImageUrls(request.getImageUrls());
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    @Override
    public ReviewResponse updateReview(String reviewId, UpdateReviewRequest request, String currentUserId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Review not found"));

        if (!review.getUserId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own reviews");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setImageUrls(request.getImageUrls());
        review.setUpdatedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    @Override
    public void deleteReview(String reviewId, String currentUserId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Review not found"));

        if (!review.getUserId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    @Override
    public ReviewResponse getReviewById(String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Review not found"));
        return mapToResponse(review);
    }

    @Override
    public List<ReviewResponse> getReviewsForDestination(String destinationId) {
        return reviewRepository.findByDestinationIdOrderByCreatedAtDesc(destinationId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getReviewsByCurrentUser(String currentUserId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(currentUserId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ReviewResponse mapToResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setDestinationId(review.getDestinationId());
        response.setUserId(review.getUserId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setImageUrls(review.getImageUrls());
        response.setCreatedAt(review.getCreatedAt());
        response.setUpdatedAt(review.getUpdatedAt());
        return response;
    }
}
