package com.tourguide.reviewservice.controller;

import com.tourguide.reviewservice.dto.LoginRequest;
import com.tourguide.reviewservice.dto.AuthResponse;
import com.tourguide.reviewservice.model.User;
import com.tourguide.reviewservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        String result = authService.login(request.getUsername(), request.getPassword());

        if (result.equals("User not found") || result.equals("Invalid password")) {
            throw new RuntimeException(result);
        }

        return new AuthResponse(result); // return the JWT token
    }
}