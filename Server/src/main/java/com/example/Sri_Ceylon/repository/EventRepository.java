package com.example.Sri_Ceylon.repository;

import com.example.Sri_Ceylon.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    Optional<Event> findById(String id);
    List<Event> findAll();
}
