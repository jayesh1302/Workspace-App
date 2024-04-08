package com.nyuroject.WorkplaceManagement.controller;

import com.nyuroject.WorkplaceManagement.model.User;
import com.nyuroject.WorkplaceManagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

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

    @GetMapping("/findId/{userName}")
    public ResponseEntity<?> getUserIdByUsername(@PathVariable String userName) {
        Integer userId = userService.getUserIdByUsername(userName);
        if (userId != null) {
            return ResponseEntity.ok(userId);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "Username not found"));
        }
    }

    @GetMapping({"/getusername/{userId}"})
    public ResponseEntity<String> getUsernameById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUsernameById(userId));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> createUser(@RequestBody User user) {
        Optional<User> existingUser = userService.findByUsername(user.getUsername());

        if (existingUser.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", "Username already exists. Please use another username."));
        }

        User savedUser = userService.saveUser(user);
        savedUser.setPassword(null); // It's a good practice not to expose the password, even if it's hashed
        Map<String, String> response = Collections.singletonMap("message", "User registered successfully. Please log in");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User loginUser) {
        Optional<User> optionalUser = userService.findByUsername(loginUser.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "Username does not exist. Please sign up."));
        }

        User user = optionalUser.get();
        if (!userService.isPasswordMatch(loginUser.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", "Bad credentials."));
        }

        return ResponseEntity.ok(Collections.singletonMap("message", "User logged in successfully."));
    }

}
