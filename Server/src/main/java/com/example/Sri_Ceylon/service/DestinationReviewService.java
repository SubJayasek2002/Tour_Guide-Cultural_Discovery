package com.example.Sri_Ceylon.service;

import com.example.Sri_Ceylon.dto.CreateDestinationReviewRequest;
import com.example.Sri_Ceylon.dto.DestinationReviewResponse;
import com.example.Sri_Ceylon.dto.UpdateDestinationReviewRequest;
import com.example.Sri_Ceylon.model.Destination;
import com.example.Sri_Ceylon.model.DestinationReview;
import com.example.Sri_Ceylon.model.User;
import com.example.Sri_Ceylon.repository.DestinationRepository;
import com.example.Sri_Ceylon.repository.DestinationReviewRepository;
import com.example.Sri_Ceylon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationReviewService {
    
    @Autowired
    private DestinationReviewRepository destinationReviewRepository;
    
    @Autowired
    private DestinationRepository destinationRepository;
    
    @Autowired
    private UserRepository userRepository;

    public DestinationReviewResponse createReview(CreateDestinationReviewRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Destination destination = destinationRepository.findById(request.getDestinationId())
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + request.getDestinationId()));
        
        DestinationReview review = new DestinationReview();
        review.setDestination(destination);
        review.setUser(user);
        review.setRate(request.getRate());
        review.setReview(request.getReview());
        review.setImageUrls(request.getImageUrls());
        review.setTimestamp(LocalDateTime.now());
        
        DestinationReview savedReview = destinationReviewRepository.save(review);
        return mapToResponse(savedReview);
    }

    public DestinationReviewResponse updateReview(String reviewId, UpdateDestinationReviewRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        DestinationReview review = destinationReviewRepository.findByIdAndUserId(reviewId, user.getId())
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
        
        DestinationReview updatedReview = destinationReviewRepository.save(review);
        return mapToResponse(updatedReview);
    }

    public void deleteReview(String reviewId, String username, boolean isAdmin) {
        DestinationReview review = destinationReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        
        if (!isAdmin && !review.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to delete this review");
        }
        
        destinationReviewRepository.delete(review);
    }

    public List<DestinationReviewResponse> getReviewsByDestinationId(String destinationId) {
        return destinationReviewRepository.findByDestinationId(destinationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DestinationReviewResponse getReviewById(String reviewId) {
        DestinationReview review = destinationReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        return mapToResponse(review);
    }

    private DestinationReviewResponse mapToResponse(DestinationReview review) {
        DestinationReviewResponse response = new DestinationReviewResponse();
        response.setId(review.getId());
        response.setRate(review.getRate());
        response.setReview(review.getReview());
        response.setImageUrls(review.getImageUrls());
        response.setTimestamp(review.getTimestamp());
        
        if (review.getDestination() != null) {
            response.setDestinationId(review.getDestination().getId());
            response.setDestinationTitle(review.getDestination().getTitle());
        }
        
        if (review.getUser() != null) {
            response.setUserId(review.getUser().getId());
            response.setUsername(review.getUser().getUsername());
        }
        
        return response;
    }
}
