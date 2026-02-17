package com.example.Sri_Ceylon.service;

import com.example.Sri_Ceylon.dto.CreateEventReviewRequest;
import com.example.Sri_Ceylon.dto.EventReviewResponse;
import com.example.Sri_Ceylon.dto.UpdateEventReviewRequest;
import com.example.Sri_Ceylon.model.Event;
import com.example.Sri_Ceylon.model.EventReview;
import com.example.Sri_Ceylon.model.User;
import com.example.Sri_Ceylon.repository.EventRepository;
import com.example.Sri_Ceylon.repository.EventReviewRepository;
import com.example.Sri_Ceylon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventReviewService {
    
    @Autowired
    private EventReviewRepository eventReviewRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;

    public EventReviewResponse createReview(CreateEventReviewRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + request.getEventId()));
        
        EventReview review = new EventReview();
        review.setEvent(event);
        review.setUser(user);
        review.setRate(request.getRate());
        review.setReview(request.getReview());
        review.setImageUrls(request.getImageUrls());
        review.setTimestamp(LocalDateTime.now());
        
        EventReview savedReview = eventReviewRepository.save(review);
        return mapToResponse(savedReview);
    }

    public EventReviewResponse updateReview(String reviewId, UpdateEventReviewRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        EventReview review = eventReviewRepository.findByIdAndUserId(reviewId, user.getId())
                .orElseThrow(() -> new RuntimeException("Review not found or you don't have permission to update it"));
        
        if (request.getRate() != null) {
            review.setRate(request.getRate());
        }
        if (request.getReview() != null) {
            review.setReview(request.getReview());
        }
        if (request.getImageUrls() != null) {
            review.setImageUrls(request.getImageUrls());
        }
        
        EventReview updatedReview = eventReviewRepository.save(review);
        return mapToResponse(updatedReview);
    }

    public void deleteReview(String reviewId, String username, boolean isAdmin) {
        EventReview review = eventReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        
        if (!isAdmin && !review.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to delete this review");
        }
        
        eventReviewRepository.delete(review);
    }

    public List<EventReviewResponse> getReviewsByEventId(String eventId) {
        return eventReviewRepository.findByEventId(eventId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EventReviewResponse getReviewById(String reviewId) {
        EventReview review = eventReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        return mapToResponse(review);
    }

    private EventReviewResponse mapToResponse(EventReview review) {
        EventReviewResponse response = new EventReviewResponse();
        response.setId(review.getId());
        response.setRate(review.getRate());
        response.setReview(review.getReview());
        response.setImageUrls(review.getImageUrls());
        response.setTimestamp(review.getTimestamp());
        
        if (review.getEvent() != null) {
            response.setEventId(review.getEvent().getId());
            response.setEventTitle(review.getEvent().getTitle());
        }
        
        if (review.getUser() != null) {
            response.setUserId(review.getUser().getId());
            response.setUsername(review.getUser().getUsername());
            response.setUserProfileImageUrl(review.getUser().getProfileImageUrl());
        }
        
        return response;
    }
}
