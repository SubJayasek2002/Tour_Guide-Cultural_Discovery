package com.example.Sri_Ceylon.controller;

import com.example.Sri_Ceylon.dto.MessageResponse;
import com.example.Sri_Ceylon.dto.UpdateUserRequest;
import com.example.Sri_Ceylon.dto.UserResponse;
import com.example.Sri_Ceylon.security.UserDetailsImpl;
import com.example.Sri_Ceylon.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Set;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        UserResponse userResponse = userService.getUserById(userDetails.getId());
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userService.getUserById(#id).username == authentication.principal.username")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        UserResponse userResponse = userService.getUserById(id);
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/username/{username}")
    @PreAuthorize("hasRole('ADMIN') or #username == authentication.principal.username")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        UserResponse userResponse = userService.getUserByUsername(username);
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UserResponse> updateUser(@PathVariable String id,
            @Valid @RequestBody UpdateUserRequest updateRequest) {
        UserResponse userResponse = userService.updateUser(id, updateRequest);
        return ResponseEntity.ok(userResponse);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> toggleUserStatus(@PathVariable String id) {
        UserResponse userResponse = userService.toggleUserStatus(id);
        return ResponseEntity.ok(userResponse);
    }

    // --- Endpoints for the authenticated user (use id from JWT/principal) ---
    @GetMapping("/me/favorites/destinations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Set<String>> getMyFavoriteDestinations(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Set<String> favorites = userService.getFavoriteDestinations(userDetails.getId());
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/me/favorites/destinations/{destinationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Set<String>> addMyFavoriteDestination(Authentication authentication,
            @PathVariable String destinationId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Set<String> favorites = userService.addFavoriteDestination(userDetails.getId(), destinationId);
        return ResponseEntity.ok(favorites);
    }

    @DeleteMapping("/me/favorites/destinations/{destinationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Set<String>> removeMyFavoriteDestination(Authentication authentication,
            @PathVariable String destinationId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Set<String> favorites = userService.removeFavoriteDestination(userDetails.getId(), destinationId);
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/me/favorites/events")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Set<String>> getMyFavoriteEvents(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Set<String> favorites = userService.getFavoriteEvents(userDetails.getId());
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/me/favorites/events/{eventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Set<String>> addMyFavoriteEvent(Authentication authentication, @PathVariable String eventId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Set<String> favorites = userService.addFavoriteEvent(userDetails.getId(), eventId);
        return ResponseEntity.ok(favorites);
    }

    @DeleteMapping("/me/favorites/events/{eventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Set<String>> removeMyFavoriteEvent(Authentication authentication,
            @PathVariable String eventId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Set<String> favorites = userService.removeFavoriteEvent(userDetails.getId(), eventId);
        return ResponseEntity.ok(favorites);
    }

    // --- Admin endpoints to manage favorites for any user ---
    @GetMapping("/{id}/favorites/destinations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Set<String>> getFavoriteDestinations(@PathVariable String id) {
        Set<String> favorites = userService.getFavoriteDestinations(id);
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/{id}/favorites/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Set<String>> getFavoriteEvents(@PathVariable String id) {
        Set<String> favorites = userService.getFavoriteEvents(id);
        return ResponseEntity.ok(favorites);
    }
}
