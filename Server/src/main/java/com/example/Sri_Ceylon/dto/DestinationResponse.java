package com.example.Sri_Ceylon.dto;

import java.time.LocalDateTime;
import java.util.List;

public class DestinationResponse {
    private String id;
    private String title;
    private String description;
    private List<String> imageUrls;
    private String bestSeasonToVisit;
    private String location;
    private Double latitude;
    private Double longitude;
    private LocalDateTime timestamp;
    private String createdById;
    private String createdByUsername;

    // Constructors
    public DestinationResponse() {}

    public DestinationResponse(String id, String title, String description, List<String> imageUrls,
                              String bestSeasonToVisit, String location, Double latitude, Double longitude,
                              LocalDateTime timestamp,
                              String createdById, String createdByUsername) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageUrls = imageUrls;
        this.bestSeasonToVisit = bestSeasonToVisit;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
        this.createdById = createdById;
        this.createdByUsername = createdByUsername;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getCreatedById() {
        return createdById;
    }

    public void setCreatedById(String createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByUsername() {
        return createdByUsername;
    }

    public void setCreatedByUsername(String createdByUsername) {
        this.createdByUsername = createdByUsername;
    }
}
