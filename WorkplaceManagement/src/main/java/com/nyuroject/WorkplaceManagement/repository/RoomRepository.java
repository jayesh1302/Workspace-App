package com.nyuroject.WorkplaceManagement.repository;

import com.nyuroject.WorkplaceManagement.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("SELECT r FROM Room r WHERE r.WorkspaceId = ?1")
    List<Room> findRoomsByWorkspaceId(Long workspaceId);
}
