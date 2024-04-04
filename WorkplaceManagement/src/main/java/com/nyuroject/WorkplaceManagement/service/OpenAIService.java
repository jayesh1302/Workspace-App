package com.nyuroject.WorkplaceManagement.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nyuroject.WorkplaceManagement.model.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class OpenAIService {
    @Value("${openai.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String sendMessageToOpenAI(String message) throws JsonProcessingException {
        String url = "https://api.openai.com/v1/chat/completions";

        String summarizationInstruction = "Can you provide a summary of the above conversation?";
        message += "\n" + summarizationInstruction;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        Map<String, Object> messageMap = new HashMap<>();
        messageMap.put("role", "user");
        messageMap.put("content", message);

        Map<String, Object> payloadMap = new HashMap<>();
        payloadMap.put("model", "gpt-3.5-turbo");
        payloadMap.put("messages", Collections.singletonList(messageMap));

        // Convert the payload to JSON string using Jackson
        ObjectMapper objectMapper = new ObjectMapper();
        String payload = objectMapper.writeValueAsString(payloadMap);

        HttpEntity<String> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response;
        try {
            response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        } catch (HttpClientErrorException e) {
            // Handle the exception, possibly log it, and create an appropriate response
            response = new ResponseEntity<>(e.getResponseBodyAsString(), e.getStatusCode());
        }

        return response.getBody();
    }

    public String searchOpenAI(Message message) throws JsonProcessingException {
        String url = "https://api.openai.com/v1/chat/completions";
        String summarizationInstruction = "Give a solution for the issue below:";
        String messageContentWithInstruction = message.getContent() + "\n" + summarizationInstruction;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        Map<String, Object> messageMap = new HashMap<>();
        messageMap.put("role", "user");
        messageMap.put("content", messageContentWithInstruction);

        Map<String, Object> payloadMap = new HashMap<>();
        payloadMap.put("model", "gpt-3.5-turbo");
        payloadMap.put("messages", Collections.singletonList(messageMap));

        // Convert the payload to JSON string using Jackson
        ObjectMapper objectMapper = new ObjectMapper();
        String payload = objectMapper.writeValueAsString(payloadMap);

        HttpEntity<String> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response;
        try {
            response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        } catch (HttpClientErrorException e) {
            // Handle the exception, possibly log it, and create an appropriate response
            response = new ResponseEntity<>(e.getResponseBodyAsString(), e.getStatusCode());
        }

        return response.getBody();
    }
}

