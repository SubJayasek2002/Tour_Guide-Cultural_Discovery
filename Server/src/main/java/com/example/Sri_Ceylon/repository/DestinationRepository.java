package com.example.Sri_Ceylon.repository;

import com.example.Sri_Ceylon.model.Destination;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DestinationRepository extends MongoRepository<Destination, String> {
    Optional<Destination> findById(String id);
    List<Destination> findAll();
}
