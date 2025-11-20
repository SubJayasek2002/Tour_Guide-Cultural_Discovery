package com.example.Events.Repository;

import com.example.Events.Model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    public Event findByEventName(String eventName);
    public Event findByLocation (String location);
}
