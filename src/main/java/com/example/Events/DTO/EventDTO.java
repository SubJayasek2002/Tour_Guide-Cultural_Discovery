package com.example.Events.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;



@Getter
@Setter
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
    private LocalDate date;
    private String description;

}
