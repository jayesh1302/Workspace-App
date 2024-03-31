package com.nyuroject.WorkplaceManagement.controller;

import com.nyuroject.WorkplaceManagement.service.OpenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/openai")
public class OpenAIController {
    private final OpenAIService openAIService;

    @Autowired
    public OpenAIController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

//    @GetMapping("/send-hello")
//    public ResponseEntity<String> getHelloResponse() {
//        String response = openAIService.sendMessageToOpenAI("Hello");
//        return ResponseEntity.ok(response);
//    }
}
