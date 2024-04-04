package com.nyuroject.WorkplaceManagement.controller;

import com.nyuroject.WorkplaceManagement.model.User;
import com.nyuroject.WorkplaceManagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    public final UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping({"/getusername/{userId}"})
    public ResponseEntity<String> getUsernameById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUsernameById(userId));
    }

    @PostMapping("/register")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        savedUser.setPassword(null);
        return ResponseEntity.ok(savedUser);
    }
}
