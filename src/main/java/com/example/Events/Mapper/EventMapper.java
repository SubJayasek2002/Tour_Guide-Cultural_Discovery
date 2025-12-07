package com.example.Events.Mapper;

import com.example.Events.DTO.EventDTO;
import com.example.Events.Model.Event;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EventMapper {
    // --- Entity to DTO ---
    public EventDTO toDTO(Event event) {
        if (event == null) {
            return null;
        }
        //Creating the new DTO object
        EventDTO eventDTO = new EventDTO();
        //Mapping the attributes of the DTO object with the entered Entity object.
        eventDTO.setEventName(event.getEventName());
        eventDTO.setLocation(event.getLocation());
        eventDTO.setDate(event.getDate());
        eventDTO.setDescription(event.getDescription());

        //Returning the mapped DTO object
        return eventDTO;
    }

    public List<EventDTO> toDTOList(List<Event> events) {
        return events.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // --- DTO to Entity ---
    public Event toEntity(EventDTO dto) {
        if (dto == null) {
            return null;
        }
        //Creating the New Entity Object
        Event entity = new Event();

        //Mapping the attributes of the Entity object with the entered DTO object
        entity.setEventName(dto.getEventName());
        entity.setLocation(dto.getLocation());
        entity.setDate(dto.getDate());

        //Returning the Mapped Entity Object
        return entity;
    }

    // Required for null-safe update
    public void updateEntityFromDTO(EventDTO eventDTO, Event event) {
        if (eventDTO.getEventName() != null) {
            event.setEventName(eventDTO.getEventName());
        }
        if (eventDTO.getLocation() != null) {
            event.setLocation(eventDTO.getLocation());
        }
        if (eventDTO.getDate() != null) {
            event.setDate(eventDTO.getDate());
        }
        if (eventDTO.getDescription() != null) {
            event.setDescription(eventDTO.getDescription());
        }

    }
}
