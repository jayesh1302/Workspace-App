package com.nyuroject.WorkplaceManagement.repository;

import com.nyuroject.WorkplaceManagement.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

import static javax.swing.text.html.HTML.Tag.SELECT;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE m.roomId = ?1")
    List<Message> findMessagesByRoomId(Long roomId);
}
