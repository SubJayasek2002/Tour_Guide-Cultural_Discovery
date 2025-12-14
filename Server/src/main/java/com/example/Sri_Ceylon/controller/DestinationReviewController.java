package com.example.Sri_Ceylon.controller;

import com.example.Sri_Ceylon.dto.CreateDestinationReviewRequest;
import com.example.Sri_Ceylon.dto.DestinationReviewResponse;
import com.example.Sri_Ceylon.dto.MessageResponse;
import com.example.Sri_Ceylon.dto.UpdateDestinationReviewRequest;
import com.example.Sri_Ceylon.security.UserDetailsImpl;
import com.example.Sri_Ceylon.service.DestinationReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations/reviews")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DestinationReviewController {

    @Autowired
    private DestinationReviewService destinationReviewService;

    // Public endpoints
    @GetMapping("/destination/{destinationId}")
    public ResponseEntity<List<DestinationReviewResponse>> getReviewsByDestinationId(@PathVariable String destinationId) {
        List<DestinationReviewResponse> reviews = destinationReviewService.getReviewsByDestinationId(destinationId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<DestinationReviewResponse> getReviewById(@PathVariable String reviewId) {
        DestinationReviewResponse review = destinationReviewService.getReviewById(reviewId);
        return ResponseEntity.ok(review);
    }

    // Authenticated user endpoints
    @PostMapping
    public ResponseEntity<DestinationReviewResponse> createReview(
            @Valid @RequestBody CreateDestinationReviewRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        DestinationReviewResponse review = destinationReviewService.createReview(request, userDetails.getUsername());
        return ResponseEntity.ok(review);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<DestinationReviewResponse> updateReview(
            @PathVariable String reviewId,
            @Valid @RequestBody UpdateDestinationReviewRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        DestinationReviewResponse review = destinationReviewService.updateReview(reviewId, request, userDetails.getUsername());
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<MessageResponse> deleteReview(
            @PathVariable String reviewId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        boolean isAdmin = userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        destinationReviewService.deleteReview(reviewId, userDetails.getUsername(), isAdmin);
        return ResponseEntity.ok(new MessageResponse("Review deleted successfully!"));
    }
}
