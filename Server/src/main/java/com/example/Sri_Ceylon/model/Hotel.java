package com.example.Sri_Ceylon.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "hotels")
public class Hotel {
    @Id
    private String id;

    private String name;
    private String description;
    private String address;
    private List<String> phones; // Multiple phone numbers
    private String whatsapp;
    private String email;
    private String website;
    private List<String> amenities;
    private List<String> imageUrls;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint coordinates;

    private Boolean isPaid = false; // Must pay to be visible
    private LocalDateTime createdAt = LocalDateTime.now();

    @DBRef
    private User createdBy;

    public Hotel() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public List<String> getPhones() { return phones; }
    public void setPhones(List<String> phones) { this.phones = phones; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

    public GeoJsonPoint getCoordinates() { return coordinates; }
    public void setCoordinates(GeoJsonPoint coordinates) { this.coordinates = coordinates; }

    public Double getLatitude() { return coordinates != null ? coordinates.getY() : null; }
    public Double getLongitude() { return coordinates != null ? coordinates.getX() : null; }

    public Boolean getIsPaid() { return isPaid; }
    public void setIsPaid(Boolean isPaid) { this.isPaid = isPaid; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
}
