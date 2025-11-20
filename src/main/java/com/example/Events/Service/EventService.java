package com.example.Events.Service;

import com.example.Events.DTO.EventDTO;
import com.example.Events.Repository.EventRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public interface EventService {
    public EventDTO addEvent(EventDTO eventDTO);
    public void removeEvent(String eventName);
    public EventDTO findByLocation(String location);
}
