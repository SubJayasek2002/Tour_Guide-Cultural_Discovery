package com.tourguide.reviewservice.controller;

import com.tourguide.reviewservice.dto.CreateReviewRequest;
import com.tourguide.reviewservice.dto.ReviewResponse;
import com.tourguide.reviewservice.dto.UpdateReviewRequest;
import com.tourguide.reviewservice.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin // optional: enable if frontend is on another origin
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // ----------- Public endpoints -----------

    @GetMapping("/destination/{destinationId}")
    public List<ReviewResponse> getReviewsForDestination(@PathVariable String destinationId) {
        return reviewService.getReviewsForDestination(destinationId);
    }

    @GetMapping("/{reviewId}")
    public ReviewResponse getReviewById(@PathVariable String reviewId) {
        return reviewService.getReviewById(reviewId);
    }

    // ----------- Authenticated endpoints -----------

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse createReview(@Valid @RequestBody CreateReviewRequest request) {
        String currentUserId = getCurrentUserIdFromSecurityContext();
        return reviewService.createReview(request, currentUserId);
    }

    @PutMapping("/{reviewId}")
    public ReviewResponse updateReview(@PathVariable String reviewId,
            @Valid @RequestBody UpdateReviewRequest request) {
        String currentUserId = getCurrentUserIdFromSecurityContext();
        return reviewService.updateReview(reviewId, request, currentUserId);
    }

    @DeleteMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable String reviewId) {
        String currentUserId = getCurrentUserIdFromSecurityContext();
        reviewService.deleteReview(reviewId, currentUserId);
    }

    @GetMapping("/me")
    public List<ReviewResponse> getMyReviews() {
        String currentUserId = getCurrentUserIdFromSecurityContext();
        return reviewService.getReviewsByCurrentUser(currentUserId);
    }

    // ----------- Helper: who is the current user? -----------

    private String getCurrentUserIdFromSecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication instanceof AnonymousAuthenticationToken) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        // In your current setup this is the username (HTTP Basic principal)
        return authentication.getName();
    }
}
