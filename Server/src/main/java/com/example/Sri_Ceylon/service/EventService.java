package com.example.Sri_Ceylon.service;

import com.example.Sri_Ceylon.dto.CreateEventRequest;
import com.example.Sri_Ceylon.dto.EventResponse;
import com.example.Sri_Ceylon.dto.UpdateEventRequest;
import com.example.Sri_Ceylon.model.Event;
import com.example.Sri_Ceylon.model.User;
import com.example.Sri_Ceylon.repository.EventRepository;
import com.example.Sri_Ceylon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;

    public EventResponse createEvent(CreateEventRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setImageUrls(request.getImageUrls());
        event.setStart(request.getStart());
        event.setEnd(request.getEnd());
        event.setLocation(request.getLocation());
        event.setTimestamp(LocalDateTime.now());
        event.setCreatedBy(user);
        
        Event savedEvent = eventRepository.save(event);
        return mapToEventResponse(savedEvent);
    }

    public EventResponse updateEvent(String eventId, UpdateEventRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        if (request.getTitle() != null) {
            event.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }
        if (request.getImageUrls() != null) {
            event.setImageUrls(request.getImageUrls());
        }
        if (request.getStart() != null) {
            event.setStart(request.getStart());
        }
        if (request.getEnd() != null) {
            event.setEnd(request.getEnd());
        }
        if (request.getLocation() != null) {
            event.setLocation(request.getLocation());
        }
        
        Event updatedEvent = eventRepository.save(event);
        return mapToEventResponse(updatedEvent);
    }

    public void deleteEvent(String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        eventRepository.delete(event);
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    public EventResponse getEventById(String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        return mapToEventResponse(event);
    }

    private EventResponse mapToEventResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setImageUrls(event.getImageUrls());
        response.setStart(event.getStart());
        response.setEnd(event.getEnd());
        response.setLocation(event.getLocation());
        response.setTimestamp(event.getTimestamp());
        
        if (event.getCreatedBy() != null) {
            response.setCreatedById(event.getCreatedBy().getId());
            response.setCreatedByUsername(event.getCreatedBy().getUsername());
        }
        
        return response;
    }
}
