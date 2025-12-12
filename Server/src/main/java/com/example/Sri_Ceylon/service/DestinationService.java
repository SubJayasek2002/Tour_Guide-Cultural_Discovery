package com.example.Sri_Ceylon.service;

import com.example.Sri_Ceylon.dto.CreateDestinationRequest;
import com.example.Sri_Ceylon.dto.DestinationResponse;
import com.example.Sri_Ceylon.dto.UpdateDestinationRequest;
import com.example.Sri_Ceylon.model.Destination;
import com.example.Sri_Ceylon.model.User;
import com.example.Sri_Ceylon.repository.DestinationRepository;
import com.example.Sri_Ceylon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {
    
    @Autowired
    private DestinationRepository destinationRepository;
    
    @Autowired
    private UserRepository userRepository;

    public DestinationResponse createDestination(CreateDestinationRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Destination destination = new Destination();
        destination.setTitle(request.getTitle());
        destination.setDescription(request.getDescription());
        destination.setImageUrls(request.getImageUrls());
        destination.setBestSeasonToVisit(request.getBestSeasonToVisit());
        destination.setLocation(request.getLocation());
        destination.setTimestamp(LocalDateTime.now());
        destination.setCreatedBy(user);
        
        Destination savedDestination = destinationRepository.save(destination);
        return mapToDestinationResponse(savedDestination);
    }

    public DestinationResponse updateDestination(String destinationId, UpdateDestinationRequest request) {
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + destinationId));
        
        if (request.getTitle() != null) {
            destination.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            destination.setDescription(request.getDescription());
        }
        if (request.getImageUrls() != null) {
            destination.setImageUrls(request.getImageUrls());
        }
        if (request.getBestSeasonToVisit() != null) {
            destination.setBestSeasonToVisit(request.getBestSeasonToVisit());
        }
        if (request.getLocation() != null) {
            destination.setLocation(request.getLocation());
        }
        
        Destination updatedDestination = destinationRepository.save(destination);
        return mapToDestinationResponse(updatedDestination);
    }

    public void deleteDestination(String destinationId) {
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + destinationId));
        destinationRepository.delete(destination);
    }

    public List<DestinationResponse> getAllDestinations() {
        return destinationRepository.findAll().stream()
                .map(this::mapToDestinationResponse)
                .collect(Collectors.toList());
    }

    public DestinationResponse getDestinationById(String destinationId) {
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + destinationId));
        return mapToDestinationResponse(destination);
    }

    private DestinationResponse mapToDestinationResponse(Destination destination) {
        DestinationResponse response = new DestinationResponse();
        response.setId(destination.getId());
        response.setTitle(destination.getTitle());
        response.setDescription(destination.getDescription());
        response.setImageUrls(destination.getImageUrls());
        response.setBestSeasonToVisit(destination.getBestSeasonToVisit());
        response.setLocation(destination.getLocation());
        response.setTimestamp(destination.getTimestamp());
        
        if (destination.getCreatedBy() != null) {
            response.setCreatedById(destination.getCreatedBy().getId());
            response.setCreatedByUsername(destination.getCreatedBy().getUsername());
        }
        
        return response;
    }
}
