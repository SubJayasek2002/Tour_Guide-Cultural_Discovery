package com.example.Events.Service;

import com.example.Events.DTO.EventDTO;
import com.example.Events.Repository.EventRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public interface EventService {
    EventDTO addEvent(EventDTO eventDTO);

    EventDTO getById(String id);
    EventDTO getByName(String eventName);
    List<EventDTO> getByLocation(String location);
    List<EventDTO> getByDate(Date date);

    EventDTO updateEvent(EventDTO eventDTO);

    void removeEvent(String id);
    void removeEventByName(String eventName);
    void removeEventByLocation(String location);
    void removeEventByDate(Date date);



}
