package com.example.Sri_Ceylon.repository;

import com.example.Sri_Ceylon.model.Hotel;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface HotelRepository extends MongoRepository<Hotel, String> {
    List<Hotel> findByCoordinatesNear(Point point, Distance distance);
}
