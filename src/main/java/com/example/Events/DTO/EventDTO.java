package com.example.Events.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor

public class EventDTO {
    private String id;

    @NotBlank(message="Event Name Cannot be empty")
    private String eventName;

    @NotBlank(message="Event Location Cannot be empty")
    private String location;

    @NotNull(message = "Event Date cannot be empty")
    @Future(message = "Event Date must be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date date;

    private String description;

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getId() {
        return id;
    }
}
