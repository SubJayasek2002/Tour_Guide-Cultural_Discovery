package com.example.Sri_Ceylon.dto;

import java.util.List;

public class UserProfileResponse {
    private UserResponse user;
    private List<DestinationResponse> favoriteDestinations;
    private List<EventResponse> favoriteEvents;

    public UserProfileResponse() {}

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public List<DestinationResponse> getFavoriteDestinations() {
        return favoriteDestinations;
    }

    public void setFavoriteDestinations(List<DestinationResponse> favoriteDestinations) {
        this.favoriteDestinations = favoriteDestinations;
    }

    public List<EventResponse> getFavoriteEvents() {
        return favoriteEvents;
    }

    public void setFavoriteEvents(List<EventResponse> favoriteEvents) {
        this.favoriteEvents = favoriteEvents;
    }
}
