package com.tourguide.reviewservice.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateReviewRequest {

    @NotBlank(message = "Destination ID is required")
    private String destinationId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @NotBlank(message = "Comment is required")
    @Size(min = 5, max = 5000, message = "Comment must be between 5 and 5000 characters")
    private String comment;

    // Optional list of image URLs
    private List<String> imageUrls;
}