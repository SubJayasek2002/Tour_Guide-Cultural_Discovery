package com.tourguide.reviewservice.repository;

import com.tourguide.reviewservice.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
}