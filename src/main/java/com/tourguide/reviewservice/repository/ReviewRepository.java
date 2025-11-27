package com.tourguide.reviewservice.repository;

import com.tourguide.reviewservice.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByDestinationIdOrderByCreatedAtDesc(String destinationId);

    List<Review> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<Review> findByDestinationIdAndUserId(String destinationId, String userId);

    // for rating calculation (order not important)
    List<Review> findByDestinationId(String destinationId);
}