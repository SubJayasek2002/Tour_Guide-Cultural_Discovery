package com.tourguide.reviewservice.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReviewResponse {

    private String id;
    private String destinationId;
    private String userId;
    private int rating;
    private String comment;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
