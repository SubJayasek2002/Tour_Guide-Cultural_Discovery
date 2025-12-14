package com.example.Sri_Ceylon.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "destination_reviews")
public class DestinationReview {
    @Id
    private String id;
    
    @DBRef
    private Destination destination;
    
    @DBRef
    private User user;
    
    private Integer rate;
    private String review;
    private List<String> imageUrls;
    private LocalDateTime timestamp;

    // Constructors
    public DestinationReview() {
        this.timestamp = LocalDateTime.now();
    }

    public DestinationReview(Destination destination, User user, Integer rate, String review, List<String> imageUrls) {
        this.destination = destination;
        this.user = user;
        this.rate = rate;
        this.review = review;
        this.imageUrls = imageUrls;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Destination getDestination() {
        return destination;
    }

    public void setDestination(Destination destination) {
        this.destination = destination;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getRate() {
        return rate;
    }

    public void setRate(Integer rate) {
        this.rate = rate;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
