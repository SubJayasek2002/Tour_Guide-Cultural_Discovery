package com.example.Sri_Ceylon.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileUploadController {

    private final Path profileUploadDir = Paths.get("uploads/profile-images");
    private final Path imageUploadDir = Paths.get("uploads/images");

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(profileUploadDir);
            Files.createDirectories(imageUploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directories!", e);
        }
    }

    private ResponseEntity<Map<String, String>> handleUpload(MultipartFile file, Path targetDir, String urlPrefix, long maxSizeMB) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please select a file to upload"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Only image files are allowed"));
        }

        if (file.getSize() > maxSizeMB * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("message", "File size must be less than " + maxSizeMB + "MB"));
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;

            Path filePath = targetDir.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = urlPrefix + filename;
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to upload file"));
        }
    }

    @PostMapping("/upload/profile-image")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        return handleUpload(file, profileUploadDir, "/api/uploads/profile-images/", 5);
    }

    @PostMapping("/upload/image")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        return handleUpload(file, imageUploadDir, "/api/uploads/images/", 10);
    }

    @GetMapping("/uploads/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        return serveFile(imageUploadDir, filename);
    }

    @GetMapping("/uploads/profile-images/{filename}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable String filename) {
        return serveFile(profileUploadDir, filename);
    }

    private ResponseEntity<Resource> serveFile(Path directory, String filename) {
        try {
            Path filePath = directory.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // Determine content type
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=31536000")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
