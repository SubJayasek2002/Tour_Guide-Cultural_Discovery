package com.example.Sri_Ceylon.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String getChatResponse(String userMessage) {
        Client client = Client.builder().apiKey(apiKey).build();

        // The "Brain" of your bot
        String systemInstruction = "You are 'Aayu', a specialized Sri Lankan Tour Guide. " +
            "Respond ONLY to Sri Lankan travel and culture queries. " +
            "Greet with 'Ayubowan'. For off-topic questions, politely decline.";

        GenerateContentResponse response = client.models.generateContent(
                "gemini-2.5-flash", 
                systemInstruction + "\nUser Question: " + userMessage, 
                null
        );

        return response.text();
    }
}