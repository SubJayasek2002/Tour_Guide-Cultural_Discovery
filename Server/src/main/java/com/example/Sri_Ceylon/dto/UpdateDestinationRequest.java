package com.example.Sri_Ceylon.dto;

import java.util.List;

public class UpdateDestinationRequest {
    private String title;
    private String description;
    private List<String> imageUrls;
    private String bestSeasonToVisit;
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
