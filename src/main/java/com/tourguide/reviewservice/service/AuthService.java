package com.tourguide.reviewservice.service;

import com.tourguide.reviewservice.model.User;
import com.tourguide.reviewservice.repository.UserRepository;
import com.tourguide.reviewservice.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String register(User user) {
        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repo.save(user);
        return "User registered successfully.";
    }

    public String login(String username, String password) {
        User user = repo.findByUsername(username);
        if (user == null)
            return "User not found";
        if (!passwordEncoder.matches(password, user.getPassword()))
            return "Invalid password";

        // Return token
        return jwtUtil.generateToken(username);
    }
}