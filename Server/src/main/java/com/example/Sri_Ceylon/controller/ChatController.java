package com.example.Sri_Ceylon.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Sri_Ceylon.service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        String response = chatService.getChatResponse(userMessage);
        return ResponseEntity.ok(response);
    }
}
