package com.example.server.DTO;

import java.util.List;

public class UserDTO {
    private String userId;
    private String name;
    private String email;
    private String role;
    private List<String> favorites;

    public UserDTO() {}

    public UserDTO(String userId, String name, String email, String role, List<String> favorites) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.favorites = favorites;
    }

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<String> getFavorites() { return favorites; }
    public void setFavorites(List<String> favorites) { this.favorites = favorites; }
}
