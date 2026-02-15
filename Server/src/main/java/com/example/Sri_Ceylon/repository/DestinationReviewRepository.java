package com.example.Sri_Ceylon.repository;

import com.example.Sri_Ceylon.model.DestinationReview;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DestinationReviewRepository extends MongoRepository<DestinationReview, String> {
    List<DestinationReview> findByDestinationId(String destinationId);
    Optional<DestinationReview> findByIdAndUserId(String id, String userId);
}
