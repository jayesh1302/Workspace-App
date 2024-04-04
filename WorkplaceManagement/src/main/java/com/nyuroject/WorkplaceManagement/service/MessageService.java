package com.nyuroject.WorkplaceManagement.service;

import com.nyuroject.WorkplaceManagement.model.Message;
import com.nyuroject.WorkplaceManagement.model.Room;
import com.nyuroject.WorkplaceManagement.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public Message getMessageById(Long Id) {
        return messageRepository.findById(Id).orElse(null);
    }
    public List<Message> getAllMessagesByRoomId(Long roomId) {
        return messageRepository.findMessagesByRoomId(roomId);
    }

    public void deleteMessage(Long messageId) {
        messageRepository.deleteById(messageId);
    }
}
