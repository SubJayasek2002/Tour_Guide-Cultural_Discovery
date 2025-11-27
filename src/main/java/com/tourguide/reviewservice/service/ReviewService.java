package com.tourguide.reviewservice.service;

import com.tourguide.reviewservice.dto.CreateReviewRequest;
import com.tourguide.reviewservice.dto.ReviewResponse;
import com.tourguide.reviewservice.dto.UpdateReviewRequest;

import java.util.List;

public interface ReviewService {

    ReviewResponse createReview(CreateReviewRequest request, String currentUserId);

    ReviewResponse updateReview(String reviewId, UpdateReviewRequest request, String currentUserId);

    void deleteReview(String reviewId, String currentUserId);

    ReviewResponse getReviewById(String reviewId);

    List<ReviewResponse> getReviewsForDestination(String destinationId);

    List<ReviewResponse> getReviewsByCurrentUser(String currentUserId);
}