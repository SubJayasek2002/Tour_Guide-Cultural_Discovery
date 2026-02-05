package com.example.Sri_Ceylon.service;

import com.example.Sri_Ceylon.dto.CreateHotelRequest;
import com.example.Sri_Ceylon.dto.HotelResponse;
import com.example.Sri_Ceylon.dto.UpdateHotelRequest;
import com.example.Sri_Ceylon.model.Hotel;
import com.example.Sri_Ceylon.model.PaymentStatus;
import com.example.Sri_Ceylon.model.Role;
import com.example.Sri_Ceylon.model.User;
import com.example.Sri_Ceylon.repository.HotelRepository;
import com.example.Sri_Ceylon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private UserRepository userRepository;

    public HotelResponse createHotel(CreateHotelRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If user is not already an admin, grant them HOTEL_OWNER role
        if (!user.getRoles().contains(Role.ROLE_ADMIN)) {
            user.getRoles().add(Role.ROLE_HOTEL_OWNER);
            userRepository.save(user);
        }

        Hotel hotel = new Hotel();
        hotel.setName(request.getName());
        hotel.setDescription(request.getDescription());
        hotel.setAddress(request.getAddress());
        hotel.setPhones(request.getPhones());
        hotel.setWhatsapp(request.getWhatsapp());
        hotel.setEmail(request.getEmail());
        hotel.setWebsite(request.getWebsite());
        hotel.setAmenities(request.getAmenities());
        hotel.setImageUrls(request.getImageUrls());
        hotel.setCoordinates(new GeoJsonPoint(request.getLongitude(), request.getLatitude()));
        hotel.setIsPaid(false); // Must pay to be visible
        hotel.setCreatedBy(user);

        Hotel saved = hotelRepository.save(hotel);
        return mapToResponse(saved);
    }

    public HotelResponse updateHotel(String hotelId, UpdateHotelRequest request) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + hotelId));

        if (request.getName() != null) hotel.setName(request.getName());
        if (request.getDescription() != null) hotel.setDescription(request.getDescription());
        if (request.getAddress() != null) hotel.setAddress(request.getAddress());
        if (request.getPhones() != null) hotel.setPhones(request.getPhones());
        if (request.getWhatsapp() != null) hotel.setWhatsapp(request.getWhatsapp());
        if (request.getEmail() != null) hotel.setEmail(request.getEmail());
        if (request.getWebsite() != null) hotel.setWebsite(request.getWebsite());
        if (request.getAmenities() != null) hotel.setAmenities(request.getAmenities());
        if (request.getImageUrls() != null) hotel.setImageUrls(request.getImageUrls());
        if (request.getLatitude() != null && request.getLongitude() != null) {
            hotel.setCoordinates(new GeoJsonPoint(request.getLongitude(), request.getLatitude()));
        }
        if (request.getIsPaid() != null) {
            hotel.setIsPaid(request.getIsPaid());
        }

        Hotel updated = hotelRepository.save(hotel);
        return mapToResponse(updated);
    }

    public void setHotelPaid(String hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + hotelId));
        hotel.setIsPaid(true);
        hotelRepository.save(hotel);
    }

    public List<HotelResponse> getAllHotels() {
        return hotelRepository.findByIsPaidTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public HotelResponse getHotelById(String hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + hotelId));
        return mapToResponse(hotel);
    }

    public List<HotelResponse> getNearbyHotels(Double latitude, Double longitude, double radiusKm) {
        Point point = new Point(longitude, latitude);
        Distance distance = new Distance(radiusKm, Metrics.KILOMETERS);
        return hotelRepository.findByIsPaidTrueAndCoordinatesNear(point, distance)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteHotel(String hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + hotelId));
        hotelRepository.delete(hotel);
    }

    public List<HotelResponse> getHotelsByOwner(String ownerId) {
        return hotelRepository.findByCreatedBy_Id(ownerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private HotelResponse mapToResponse(Hotel hotel) {
        HotelResponse response = new HotelResponse();
        response.setId(hotel.getId());
        response.setName(hotel.getName());
        response.setDescription(hotel.getDescription());
        response.setAddress(hotel.getAddress());
        response.setPhones(hotel.getPhones());
        response.setWhatsapp(hotel.getWhatsapp());
        response.setEmail(hotel.getEmail());
        response.setWebsite(hotel.getWebsite());
        response.setAmenities(hotel.getAmenities());
        response.setImageUrls(hotel.getImageUrls());
        response.setLatitude(hotel.getLatitude());
        response.setLongitude(hotel.getLongitude());
        response.setIsPaid(hotel.getIsPaid());
        response.setCreatedAt(hotel.getCreatedAt());
        if (hotel.getCreatedBy() != null) {
            response.setCreatedById(hotel.getCreatedBy().getId());
            response.setCreatedByUsername(hotel.getCreatedBy().getUsername());
        }
        return response;
    }
}
