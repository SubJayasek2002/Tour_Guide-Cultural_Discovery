package com.example.Sri_Ceylon.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "destinations")
public class Destination {
    @Id
    private String id;
    
    private String title;
    private String description;
    private List<String> imageUrls;
    private String bestSeasonToVisit; // Optional field
    private String location;
    private Double latitude; // Geographic coordinate
    private Double longitude; // Geographic coordinate
    private LocalDateTime timestamp;
    
    @DBRef
    private User createdBy;

    // Constructors
    public Destination() {
        this.timestamp = LocalDateTime.now();
    }

    public Destination(String title, String description, List<String> imageUrls, 
                       String bestSeasonToVisit, String location, Double latitude, Double longitude, User createdBy) {
        this.title = title;
        this.description = description;
        this.imageUrls = imageUrls;
        this.bestSeasonToVisit = bestSeasonToVisit;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = LocalDateTime.now();
        this.createdBy = createdBy;
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

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
}
