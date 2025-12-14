package com.example.Sri_Ceylon.repository;

import com.example.Sri_Ceylon.model.EventReview;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventReviewRepository extends MongoRepository<EventReview, String> {
    List<EventReview> findByEventId(String eventId);
    Optional<EventReview> findByIdAndUserId(String id, String userId);
}
