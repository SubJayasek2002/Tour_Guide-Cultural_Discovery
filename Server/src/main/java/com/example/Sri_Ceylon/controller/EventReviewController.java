package com.example.Sri_Ceylon.controller;

import com.example.Sri_Ceylon.dto.CreateEventReviewRequest;
import com.example.Sri_Ceylon.dto.EventReviewResponse;
import com.example.Sri_Ceylon.dto.MessageResponse;
import com.example.Sri_Ceylon.dto.UpdateEventReviewRequest;
import com.example.Sri_Ceylon.security.UserDetailsImpl;
import com.example.Sri_Ceylon.service.EventReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/reviews")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EventReviewController {

    @Autowired
    private EventReviewService eventReviewService;

    // Public endpoints
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventReviewResponse>> getReviewsByEventId(@PathVariable String eventId) {
        List<EventReviewResponse> reviews = eventReviewService.getReviewsByEventId(eventId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<EventReviewResponse> getReviewById(@PathVariable String reviewId) {
        EventReviewResponse review = eventReviewService.getReviewById(reviewId);
        return ResponseEntity.ok(review);
    }

    // Authenticated user endpoints
    @PostMapping
    public ResponseEntity<EventReviewResponse> createReview(
            @Valid @RequestBody CreateEventReviewRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        EventReviewResponse review = eventReviewService.createReview(request, userDetails.getUsername());
        return ResponseEntity.ok(review);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<EventReviewResponse> updateReview(
            @PathVariable String reviewId,
            @Valid @RequestBody UpdateEventReviewRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        EventReviewResponse review = eventReviewService.updateReview(reviewId, request, userDetails.getUsername());
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<MessageResponse> deleteReview(
            @PathVariable String reviewId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        boolean isAdmin = userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        eventReviewService.deleteReview(reviewId, userDetails.getUsername(), isAdmin);
        return ResponseEntity.ok(new MessageResponse("Review deleted successfully!"));
    }
}
