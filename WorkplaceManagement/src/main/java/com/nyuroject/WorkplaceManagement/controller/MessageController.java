package com.nyuroject.WorkplaceManagement.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.nyuroject.WorkplaceManagement.model.Message;
import com.nyuroject.WorkplaceManagement.service.MessageService;
import com.nyuroject.WorkplaceManagement.service.OpenAIService;
import com.nyuroject.WorkplaceManagement.service.RoomService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);
    private final MessageService messageService;
    private final RoomService roomService;

    @Autowired
    private OpenAIService openAIService;

    @Autowired
    public MessageController(MessageService messageService, RoomService roomService) {
        this.messageService = messageService;
        this.roomService = roomService;
    }

    @PostMapping("/room/{roomId}")
    public ResponseEntity<Message> createMessage(@PathVariable Long roomId, @RequestBody Message message) {
        if(!roomService.existsById(roomId)) {
            return ResponseEntity.badRequest().build();
        }
        message.setRoomId(roomId);
        Message savedMessage = messageService.saveMessage(message);
        return ResponseEntity.ok(savedMessage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message> getMesageById(@PathVariable Long id) {
        Message message = messageService.getMessageById(id);
        return ResponseEntity.ok(message);

    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<Message>> getMessagesByRoomId(@PathVariable Long roomId) {
        List<Message> messages = messageService.getAllMessagesByRoomId(roomId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/room/{roomId}/summary")
    public ResponseEntity<?> getRoomMessagesSummary(@PathVariable Long roomId) {
        try {
            List<Message> messages = messageService.getAllMessagesByRoomId(roomId);
            String allMessagesContent = messages.stream()
                    .map(Message::getContent)
                    .collect(Collectors.joining("\n"));
            String summary = openAIService.sendMessageToOpenAI(allMessagesContent);
            return ResponseEntity.ok(summary);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing JSON: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/{messageId}/search")
    public ResponseEntity<?> getSearchSolution(@PathVariable Long messageId) {
        try {
            Message message = messageService.getMessageById(messageId);
            String solution = openAIService.searchOpenAI(message);
            return ResponseEntity.ok(solution);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing JSON: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

}
