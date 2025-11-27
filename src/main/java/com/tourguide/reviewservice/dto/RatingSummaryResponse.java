package com.tourguide.reviewservice.dto;

import lombok.Data;

@Data
public class RatingSummaryResponse {

    private String destinationId;

    // total number of reviews for this destination
    private long totalReviews;

    // average rating (e.g., 4.3)
    private double averageRating;

    // distribution of ratings
    private long oneStarCount;
    private long twoStarCount;
    private long threeStarCount;
    private long fourStarCount;
    private long fiveStarCount;
}