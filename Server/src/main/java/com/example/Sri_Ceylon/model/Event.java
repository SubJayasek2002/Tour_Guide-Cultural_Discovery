package com.example.Sri_Ceylon.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "events")
public class Event {
    @Id
    private String id;
    
    private String title;
    private String description;
    private List<String> imageUrls;
    private LocalDateTime start;
    private LocalDateTime end;
    private String location;
    private LocalDateTime timestamp;
    
    @DBRef
    private User createdBy;

    // Constructors
    public Event() {
        this.timestamp = LocalDateTime.now();
    }

    public Event(String title, String description, List<String> imageUrls, 
                 LocalDateTime start, LocalDateTime end, String location, User createdBy) {
        this.title = title;
        this.description = description;
        this.imageUrls = imageUrls;
        this.start = start;
        this.end = end;
        this.location = location;
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

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    public void setEnd(LocalDateTime end) {
        this.end = end;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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
