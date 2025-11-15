package com.example.server.controller;

import com.example.server.DTO.UserDTO;
import com.example.server.model.User;
import com.example.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Helper to convert User -> UserDTO
    private UserDTO convertToDTO(User user) {
        return new UserDTO(user.getUserId(), user.getName(), user.getEmail(),
                user.getRole(), user.getFavorites());
    }

    // Register
    @PostMapping("/register")
    public UserDTO registerUser(@RequestBody User user) {
        User saved = userService.registerUser(user);
        return convertToDTO(saved);
    }

    // Login
    @PostMapping("/login")
    public UserDTO loginUser(@RequestBody User user) {
        User loggedIn = userService.login(user.getEmail(), user.getPassword());
        return convertToDTO(loggedIn);
    }

    // Get all users
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get user by ID
    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable String id) {
        return convertToDTO(userService.getUserById(id));
    }

    // Update user
    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable String id, @RequestBody User user) {
        return convertToDTO(userService.updateUser(id, user));
    }

    // Delete user
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return "User deleted successfully!";
    }
}
