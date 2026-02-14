package com.example.Sri_Ceylon.service;

import com.example.Sri_Ceylon.dto.UpdateUserRequest;
import com.example.Sri_Ceylon.dto.UserResponse;
import com.example.Sri_Ceylon.dto.DestinationResponse;
import com.example.Sri_Ceylon.dto.EventResponse;
import com.example.Sri_Ceylon.model.Role;
import com.example.Sri_Ceylon.model.User;
import com.example.Sri_Ceylon.repository.UserRepository;
import com.example.Sri_Ceylon.repository.DestinationRepository;
import com.example.Sri_Ceylon.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import org.bson.types.ObjectId;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.query.Criteria;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;
    private final MongoTemplate mongoTemplate;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        return convertToUserResponse(user);
    }

    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return convertToUserResponse(user);
    }

    @Transactional
    public UserResponse updateUser(String id, UpdateUserRequest updateRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

        if (updateRequest.getUsername() != null && !updateRequest.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(updateRequest.getUsername())) {
                throw new RuntimeException("Username is already taken!");
            }
            user.setUsername(updateRequest.getUsername());
        }

        if (updateRequest.getEmail() != null && !updateRequest.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updateRequest.getEmail())) {
                throw new RuntimeException("Email is already in use!");
            }
            user.setEmail(updateRequest.getEmail());
        }

        if (updateRequest.getFirstName() != null) {
            user.setFirstName(updateRequest.getFirstName());
        }

        if (updateRequest.getLastName() != null) {
            user.setLastName(updateRequest.getLastName());
        }

        if (updateRequest.getPhoneNumber() != null) {
            user.setPhoneNumber(updateRequest.getPhoneNumber());
        }

        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);

        return convertToUserResponse(updatedUser);
    }

    @Transactional
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    @Transactional
    public UserResponse toggleUserStatus(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        user.setEnabled(!user.isEnabled());
        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        return convertToUserResponse(updatedUser);
    }

    @Transactional(readOnly = true)
    public Set<String> getFavoriteDestinations(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        return user.getFavoriteDestinationIds().stream()
                .map(ObjectId::toHexString)
                .collect(Collectors.toSet());
    }

    @Transactional
    public Set<String> addFavoriteDestination(String id, String destinationId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        user.getFavoriteDestinationIds().add(new ObjectId(destinationId));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return user.getFavoriteDestinationIds().stream()
                .map(ObjectId::toHexString)
                .collect(Collectors.toSet());
    }

    @Transactional
    public Set<String> removeFavoriteDestination(String id, String destinationId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        user.getFavoriteDestinationIds().remove(new ObjectId(destinationId));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return user.getFavoriteDestinationIds().stream()
                .map(ObjectId::toHexString)
                .collect(Collectors.toSet());
    }

    @Transactional(readOnly = true)
    public Set<String> getFavoriteEvents(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        return user.getFavoriteEventIds().stream()
                .map(ObjectId::toHexString)
                .collect(Collectors.toSet());
    }

    @Transactional
    public Set<String> addFavoriteEvent(String id, String eventId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        user.getFavoriteEventIds().add(new ObjectId(eventId));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return user.getFavoriteEventIds().stream()
                .map(ObjectId::toHexString)
                .collect(Collectors.toSet());
    }

    @Transactional
    public Set<String> removeFavoriteEvent(String id, String eventId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        user.getFavoriteEventIds().remove(new ObjectId(eventId));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return user.getFavoriteEventIds().stream()
                .map(ObjectId::toHexString)
                .collect(Collectors.toSet());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserProfile(String id) {
        // Use aggregation to fetch the user together with populated favorite
        // destinations and events
        MatchOperation matchUser = Aggregation.match(Criteria.where("_id").is(new ObjectId(id)));
        LookupOperation lookupDest = LookupOperation.newLookup()
                .from("destinations")
                .localField("favoriteDestinationIds")
                .foreignField("_id")
                .as("favoriteDestinations");
        LookupOperation lookupEvents = LookupOperation.newLookup()
                .from("events")
                .localField("favoriteEventIds")
                .foreignField("_id")
                .as("favoriteEvents");

        Aggregation agg = Aggregation.newAggregation(matchUser, lookupDest, lookupEvents);
        AggregationResults<Document> results = mongoTemplate.aggregate(agg, "users", Document.class);
        Document doc = results.getUniqueMappedResult();
        if (doc == null) {
            throw new UsernameNotFoundException("User not found with id: " + id);
        }

        // Convert base user part using existing mapping (convertToUserResponse expects
        // User model)
        // Load user separately for fields that are easier from the entity
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        UserResponse userResp = convertToUserResponse(user);

        List<DestinationResponse> destResponses = new ArrayList<>();
        List<Document> destDocs = (List<Document>) doc.get("favoriteDestinations");
        if (destDocs != null) {
            for (Document d : destDocs) {
                DestinationResponse r = new DestinationResponse();
                r.setId(d.getString("_id") != null ? d.getString("_id") : d.get("_id").toString());
                r.setTitle(d.getString("title"));
                r.setDescription(d.getString("description"));
                r.setImageUrls((List<String>) d.get("imageUrls"));
                r.setBestSeasonToVisit(d.getString("bestSeasonToVisit"));
                r.setLocation(d.getString("location"));
                r.setLatitude(d.getDouble("latitude"));
                r.setLongitude(d.getDouble("longitude"));
                r.setTimestamp((java.time.LocalDateTime) d.get("timestamp"));
                // createdBy is a DBRef; aggregation may include it as a Document or DBRef; skip
                // for now
                destResponses.add(r);
            }
        }

        List<EventResponse> eventResponses = new ArrayList<>();
        List<Document> eventDocs = (List<Document>) doc.get("favoriteEvents");
        if (eventDocs != null) {
            for (Document e : eventDocs) {
                EventResponse r = new EventResponse();
                r.setId(e.getString("_id") != null ? e.getString("_id") : e.get("_id").toString());
                r.setTitle(e.getString("title"));
                r.setDescription(e.getString("description"));
                r.setImageUrls((List<String>) e.get("imageUrls"));
                // start/end may be stored as Date; handle carefully
                Object startObj = e.get("start");
                if (startObj instanceof java.util.Date) {
                    r.setStart(((java.util.Date) startObj).toInstant().atZone(java.time.ZoneId.systemDefault())
                            .toLocalDateTime());
                }
                Object endObj = e.get("end");
                if (endObj instanceof java.util.Date) {
                    r.setEnd(((java.util.Date) endObj).toInstant().atZone(java.time.ZoneId.systemDefault())
                            .toLocalDateTime());
                }
                r.setLocation(e.getString("location"));
                r.setLatitude(e.getDouble("latitude"));
                r.setLongitude(e.getDouble("longitude"));
                r.setTimestamp((java.time.LocalDateTime) e.get("timestamp"));
                eventResponses.add(r);
            }
        }

        UserResponse profile = new UserResponse();
        profile.setId(userResp.getId());
        profile.setUsername(userResp.getUsername());
        profile.setEmail(userResp.getEmail());
        profile.setFirstName(userResp.getFirstName());
        profile.setLastName(userResp.getLastName());
        profile.setPhoneNumber(userResp.getPhoneNumber());
        profile.setRoles(userResp.getRoles());
        profile.setEnabled(userResp.isEnabled());
        profile.setCreatedAt(userResp.getCreatedAt());
        profile.setLastLoginAt(userResp.getLastLoginAt());
        profile.setFavoriteDestinationIds(userResp.getFavoriteDestinationIds());
        profile.setFavoriteEventIds(userResp.getFavoriteEventIds());
        return profile;
    }

    @Transactional
    public void changePassword(String id, String currentPassword, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRoles(user.getRoles().stream()
                .map(Role::name)
                .collect(Collectors.toSet()));
        response.setEnabled(user.isEnabled());
        response.setCreatedAt(user.getCreatedAt());
        response.setLastLoginAt(user.getLastLoginAt());
        response.setFavoriteDestinationIds(user.getFavoriteDestinationIds().stream()
                .map(ObjectId::toHexString)
                .collect(Collectors.toSet()));
        response.setFavoriteEventIds(user.getFavoriteEventIds().stream()
                .map(ObjectId::toHexString)
                .collect(Collectors.toSet()));
        return response;
    }
}
