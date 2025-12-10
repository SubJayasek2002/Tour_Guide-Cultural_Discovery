package com.example.Events.Controller;

import com.example.Events.DTO.EventDTO;
import com.example.Events.Service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/Events")
public class EventController {
    @Autowired
    private EventService eventService;

    @PostMapping("/Add")
    public EventDTO AddNewEvent(@RequestBody EventDTO eventDTO){
        return eventService.addEvent(eventDTO);
    }

    @GetMapping("/SearchID/{id}")
    public EventDTO SearchById(@PathVariable String id){
        return eventService.getById(id);
    }

    @GetMapping("/SearchName/{eventName}")
    public EventDTO SearchByName(@PathVariable String eventName){
        return eventService.getByName(eventName);
    }

    @GetMapping("/SearchLocation/{location}")
    public List<EventDTO> SearchByLocations(@PathVariable String location){
        return eventService.getByLocation(location);
    }

    @GetMapping("/SearchDate/{date}")
    public List<EventDTO> SearchByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String date){
        LocalDate date1 = LocalDate.parse(date.substring(0,10)); // get yyyy-MM-dd
        return eventService.getByDate(date1);
    }

    @PutMapping("/Update")
    public EventDTO Update(@RequestBody EventDTO eventDTO){
        return eventService.updateEvent(eventDTO);
    }

    @DeleteMapping("/DeleteID/{id}")
    public void DeleteEventById(@PathVariable String id){
        eventService.removeEvent(id);
    }

    @DeleteMapping("/DeleteName/{eventName}")
    public void DeleteEventByName(@PathVariable String eventName){
        eventService.removeEventByName(eventName);
    }

    @DeleteMapping("/DeleteDate/{date}")
    public void DeleteAllByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String date){
        LocalDate date1 = LocalDate.parse(date.substring(0,10)); // get yyyy-MM-dd
        eventService.removeEventByDate(date1);
    }

    @DeleteMapping("/DeleteLocation/{location}")
    public void DeleteAllByLocation(@PathVariable String location){
        eventService.removeEventByLocation(location);
    }





}

