package com.example.Events.Service.Impl;

import com.example.Events.DTO.EventDTO;
import com.example.Events.Model.Event;
import com.example.Events.Repository.EventRepository;
import com.example.Events.Service.EventService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventServiceImpl implements EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public EventDTO addEvent(EventDTO eventDTO){
        Event event = modelMapper.map(eventDTO, Event.class);
        Event saved = eventRepository.save(event);
        return modelMapper.map(saved,EventDTO.class);
    }

    @Override
    public void removeEvent(String eventName){
        Event event = eventRepository.findByEventName(eventName);
        if(event != null){
            eventRepository.delete(event);
        }

    }

    @Override
    public EventDTO findByLocation(String location) {
        Event event = eventRepository.findByLocation(location);
        if (event == null) {
            return null; // or throw custom exception
        }
        return modelMapper.map(event, EventDTO.class);
    }

}
