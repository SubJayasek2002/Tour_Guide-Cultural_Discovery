package com.example.Events.Model;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document
@AllArgsConstructor
@NoArgsConstructor
public class Event {
    @Id
    private String id;
    private String eventName;
    private String location;
    private Date date;
    private String description;
}
