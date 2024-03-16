package com.nyuroject.WorkplaceManagement.controller;

import com.nyuroject.WorkplaceManagement.model.Room;
import com.nyuroject.WorkplaceManagement.model.Workspace;
import com.nyuroject.WorkplaceManagement.service.RoomService;
import com.nyuroject.WorkplaceManagement.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;
    private final WorkspaceService workspaceService;

    @Autowired
    public RoomController(RoomService roomService, WorkspaceService workspaceService) {
        this.roomService = roomService;
        this.workspaceService = workspaceService;
    }

//    @PostMapping("/workspace/{workspaceId}")
//    public ResponseEntity<Room> createRoom(@PathVariable Long workspaceId, @RequestBody Room room) {
//        Workspace workspace = workspaceService.findById(workspaceId);
//        if (workspace == null) {
//            return ResponseEntity.badRequest().build();
//        }
//        room.setWorkspace(workspace);
//        Room savedRoom = roomService.saveRoom(room);
//
//        List<Long> roomIds = workspace.getRoomIds();
//        roomIds.add(savedRoom.getId());
//        workspace.setRoomIds(roomIds);
//        workspaceService.saveWorkspace(workspace);
//        savedRoom.setWorkspace(workspace);
//
//        return ResponseEntity.ok(savedRoom);
//    }

    @PostMapping("/workspace/{workspaceId}")
    public ResponseEntity<Room> createRoom(@PathVariable Long workspaceId, @RequestBody Room room) {
        if (!workspaceService.existsById(workspaceId)) {
            return ResponseEntity.badRequest().build();
        }

        room.setWorkspaceId(workspaceId);
        Room savedRoom = roomService.saveRoom(room);
        return ResponseEntity.ok(savedRoom);
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<Room>> getRoomsByWorkspaceId(@PathVariable Long workspaceId) {
        List<Room> rooms = roomService.getRoomsByWorkspaceId(workspaceId);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Room room = roomService.getRoomById(id);
        return ResponseEntity.ok(room);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        Room room = roomService.getRoomById(id);

        room.setName(roomDetails.getName());

        final Room updatedRoom = roomService.updateRoom(room);
        return ResponseEntity.ok(updatedRoom);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
