package com.nyuroject.WorkplaceManagement.controller;

import com.nyuroject.WorkplaceManagement.model.Message;
import com.nyuroject.WorkplaceManagement.service.MessageService;
import com.nyuroject.WorkplaceManagement.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;
    private final RoomService roomService;

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
}
