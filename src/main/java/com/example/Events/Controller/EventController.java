package com.example.Events.Controller;

import com.example.Events.DTO.EventDTO;
import com.example.Events.Service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping
public class EventController {
    @Autowired
    private EventService eventService;

    @PostMapping
    public EventDTO AddNewEvent(@RequestBody EventDTO eventDTO){
        return eventService.addEvent(eventDTO);
    }

}
