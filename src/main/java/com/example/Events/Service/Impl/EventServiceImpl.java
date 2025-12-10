package com.example.Events.Service.Impl;

import com.example.Events.DTO.EventDTO;
import com.example.Events.Exception.BadRequestException;
import com.example.Events.Exception.ResourceNotFoundException;
import com.example.Events.Mapper.EventMapper;
import com.example.Events.Model.Event;
import com.example.Events.Repository.EventRepository;
import com.example.Events.Service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Transactional
@Service
public class EventServiceImpl implements EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventMapper eventMapper;


    @Override
    public EventDTO addEvent(EventDTO eventDTO) {
        // Map DTO to Entity
        Event newEvent = eventMapper.toEntity(eventDTO);

            // Validate event name
            if (newEvent.getEventName() == null || newEvent.getEventName().trim().isEmpty()) {
                throw new BadRequestException("Event name cannot be empty");
            }

            // Validate location
            if (newEvent.getLocation() == null || newEvent.getLocation().trim().isEmpty()) {
                throw new BadRequestException("Event location cannot be empty");
            }

            //Validate the date
            if (newEvent.getDate() == null) {
                throw new BadRequestException("Event date cannot be empty");
            }



        // Save entity
        Event savedEvent = eventRepository.save(newEvent);
        // Map back to DTO for response
        return eventMapper.toDTO(savedEvent);
    }

    @Override
    public EventDTO getById(String id) {
        //Searching by id and finding the exact event
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event with ID " + id + " not found"));
        //Mapping the entity to DTO
        return eventMapper.toDTO(event);
    }

    @Override
    public EventDTO getByName(String eventName) {
        if (eventName == null || eventName.trim().isEmpty()) {
            throw new BadRequestException("Event name cannot be empty");
        }

        Event event = eventRepository.findByEventName(eventName);

        if (event == null) {
            throw new ResourceNotFoundException("Event with name '" + eventName + "' not found");
        }

        return eventMapper.toDTO(event);
    }

    @Override
    public List<EventDTO> getByLocation(String location) {
        if (location == null || location.trim().isEmpty()) {
            throw new BadRequestException("Location cannot be empty");
        }

        List<Event> events = eventRepository.findByLocation(location);

        if (events.isEmpty()) {
            throw new ResourceNotFoundException("No events found at location: " + location);
        }

        return eventMapper.toDTOList(events);
    }

    @Override
    public List<EventDTO> getByDate(LocalDate date) {
        if (date == null) {
            throw new BadRequestException("Date cannot be null");
        }

        List<Event> events = eventRepository.findByDate(date);

        if (events.isEmpty()) {
            throw new ResourceNotFoundException("No events found on date: " + date);
        }

        return eventMapper.toDTOList(events);
    }


    @Override
    public EventDTO updateEvent(EventDTO eventDTO) {
        // 1. Validation: Ensure the unique ID is present for the update commit
        if (eventDTO.getId() == null || eventDTO.getId().trim().isEmpty()) {
            throw new BadRequestException("Cannot update event: Unique ID is required in the DTO after search.");
        }

        String eventId = eventDTO.getId();

        // 2. Fetch the existing entity to ensure atomicity and validate existence
        Event existingEvent = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event with ID " + eventId + " not found."));

        // 3. Update the relevant details
        eventMapper.updateEntityFromDTO(eventDTO, existingEvent);

        // 4. Save the modified existing entity (performs an UPDATE)
        Event updatedEvent = eventRepository.save(existingEvent);

        // 5. Map the updated entity back to DTO
        return eventMapper.toDTO(updatedEvent);
    }

    @Override
    public void removeEvent(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new BadRequestException("Event ID cannot be empty for deletion");
        }
        //ID should be in the database
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event with ID " + id + " not found"));
        //Deletion of the event by id
        eventRepository.deleteById(id);
        System.out.println("Event with ID " + id + " is deleted!!!");

    }

    @Override
    public void removeEventByName(String eventName) {
        if (eventName == null || eventName.trim().isEmpty()) {
            throw new BadRequestException("Event name cannot be empty for deletion");
        }

        Event existingEvent = eventRepository.findByEventName(eventName);

        if (existingEvent == null) {
            throw new ResourceNotFoundException("Event with name '" + eventName + "' not found");
        }

        // Delete using the event name
        eventRepository.deleteByEventName(eventName);
        System.out.println("The Event "+ eventName + " is deleted!!!");
    }


    @Override
    public void removeEventByDate(LocalDate date) {
        if (date == null) {
            throw new BadRequestException("Event date cannot be empty for deletion");
        }

        List<Event> events = eventRepository.findByDate(date);

        if (events.isEmpty()) {
            throw new ResourceNotFoundException("No events found on date: " + date);
        }
        //Delete using the event date
        eventRepository.deleteByDate(date);
        System.out.println("All the events scheduled on " + date + " are deleted!!!");
    }

    @Override
    public void removeEventByLocation(String location) {
        if (location == null || location.trim().isEmpty()) {
            throw new BadRequestException("Location cannot be empty for deletion");
        }

        List<Event> events = eventRepository.findByLocation(location);

        if (events.isEmpty()) {
            throw new ResourceNotFoundException("No events found at location: " + location);
        }
        //Delete using the location
        eventRepository.deleteByLocation(location);
        System.out.println("All the events in " + location + " are deleted!!!");
    }
}

