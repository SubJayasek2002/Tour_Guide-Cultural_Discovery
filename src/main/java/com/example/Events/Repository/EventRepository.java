package com.example.Events.Repository;

import com.example.Events.Model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    //--- READ OPERATIONS ---//

    // Equivalent to your getByName
    Event findByEventName(String eventName);

    // Equivalent to your getByLocation (returns a list as location is not unique)
    List<Event> findByLocation(String location);

    // Equivalent to your getByDate (returns a list as date is not unique)
    List<Event> findByDate(LocalDate date);

    // --- DELETE OPERATIONS ---

    // Equivalent to your removeEventByName
    void deleteByEventName(String eventName);

    // Equivalent to your removeEventByLocation
    void deleteByLocation(String location);

    // Equivalent to your removeEventByDate
    void deleteByDate(LocalDate date);

    //  save() and findById() are inherited from MongoRepository
}


