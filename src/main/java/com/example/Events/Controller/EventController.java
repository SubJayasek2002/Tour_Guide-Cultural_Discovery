package com.example.Events.Controller;

import com.example.Events.DTO.EventDTO;
import com.example.Events.Model.Event;
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
    public EventDTO addNewEvent(@RequestBody EventDTO eventDTO){
        return eventService.addEvent(eventDTO);
    }

    @DeleteMapping
    public String deleteEventByName(@RequestParam String eventName){
        eventService.removeEvent(eventName);
        return eventName + "is deleted";
    }

    @GetMapping
    public EventDTO getEventBYLocation(@RequestParam String location){
        return eventService.findByLocation(location);
    }
}
