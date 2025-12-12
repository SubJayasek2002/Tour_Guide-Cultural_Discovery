package com.example.Sri_Ceylon.controller;

import com.example.Sri_Ceylon.dto.CreateDestinationRequest;
import com.example.Sri_Ceylon.dto.DestinationResponse;
import com.example.Sri_Ceylon.dto.MessageResponse;
import com.example.Sri_Ceylon.dto.UpdateDestinationRequest;
import com.example.Sri_Ceylon.security.UserDetailsImpl;
import com.example.Sri_Ceylon.service.DestinationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    // Public endpoints
    @GetMapping
    public ResponseEntity<List<DestinationResponse>> getAllDestinations() {
        List<DestinationResponse> destinations = destinationService.getAllDestinations();
        return ResponseEntity.ok(destinations);
    }

    @GetMapping("/{destinationId}")
    public ResponseEntity<DestinationResponse> getDestinationById(@PathVariable String destinationId) {
        DestinationResponse destination = destinationService.getDestinationById(destinationId);
        return ResponseEntity.ok(destination);
    }

    // Admin only endpoints
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DestinationResponse> createDestination(
            @Valid @RequestBody CreateDestinationRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        DestinationResponse destination = destinationService.createDestination(request, userDetails.getUsername());
        return ResponseEntity.ok(destination);
    }

    @PutMapping("/{destinationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DestinationResponse> updateDestination(
            @PathVariable String destinationId,
            @Valid @RequestBody UpdateDestinationRequest request) {
        DestinationResponse destination = destinationService.updateDestination(destinationId, request);
        return ResponseEntity.ok(destination);
    }

    @DeleteMapping("/{destinationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteDestination(@PathVariable String destinationId) {
        destinationService.deleteDestination(destinationId);
        return ResponseEntity.ok(new MessageResponse("Destination deleted successfully!"));
    }
}
