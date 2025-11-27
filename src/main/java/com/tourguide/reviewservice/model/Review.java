package com.tourguide.reviewservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    // Id of the destination this review belongs to
    private String destinationId;

    // Here we store the username of the user who wrote the review
    private String userId;

    private int rating;

    private String comment;

    // Optional: list of image URLs
    private List<String> imageUrls = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
