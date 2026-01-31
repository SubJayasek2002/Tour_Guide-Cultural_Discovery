package com.example.Sri_Ceylon.controller;

import com.example.Sri_Ceylon.dto.CreateHotelRequest;
import com.example.Sri_Ceylon.dto.HotelResponse;
import com.example.Sri_Ceylon.dto.MessageResponse;
import com.example.Sri_Ceylon.dto.UpdateHotelRequest;
import com.example.Sri_Ceylon.security.UserDetailsImpl;
import com.example.Sri_Ceylon.service.HotelService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*", maxAge = 3600)
public class HotelController {

    @Autowired
    private HotelService hotelService;

    // Public endpoints
    @GetMapping
    public ResponseEntity<List<HotelResponse>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    @GetMapping("/{hotelId}")
    public ResponseEntity<HotelResponse> getHotelById(@PathVariable String hotelId) {
        return ResponseEntity.ok(hotelService.getHotelById(hotelId));
    }

    @GetMapping("/near")
    public ResponseEntity<List<HotelResponse>> getNearbyHotels(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "10") Double radiusKm) {
        return ResponseEntity.ok(hotelService.getNearbyHotels(lat, lng, radiusKm));
    }

    // Admin endpoints (payment flow to be added later)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelResponse> createHotel(
            @Valid @RequestBody CreateHotelRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        HotelResponse hotel = hotelService.createHotel(request, userDetails.getUsername());
        return ResponseEntity.ok(hotel);
    }

    @PutMapping("/{hotelId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelResponse> updateHotel(
            @PathVariable String hotelId,
            @Valid @RequestBody UpdateHotelRequest request) {
        HotelResponse hotel = hotelService.updateHotel(hotelId, request);
        return ResponseEntity.ok(hotel);
    }

    @DeleteMapping("/{hotelId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteHotel(@PathVariable String hotelId) {
        hotelService.deleteHotel(hotelId);
        return ResponseEntity.ok(new MessageResponse("Hotel deleted successfully!"));
    }
}
