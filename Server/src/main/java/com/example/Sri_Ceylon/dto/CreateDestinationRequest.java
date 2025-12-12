package com.example.Sri_Ceylon.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class CreateDestinationRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private List<String> imageUrls;
    
    private String bestSeasonToVisit; // Optional
    
    @NotBlank(message = "Location is required")
    private String location;

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getBestSeasonToVisit() {
        return bestSeasonToVisit;
    }

    public void setBestSeasonToVisit(String bestSeasonToVisit) {
        this.bestSeasonToVisit = bestSeasonToVisit;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
