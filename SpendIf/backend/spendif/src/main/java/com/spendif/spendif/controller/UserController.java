package com.spendif.spendif.controller;

import com.spendif.spendif.models.User;
import com.spendif.spendif.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // allow React frontend
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // DTO to avoid sending password
    public static class UserResponse {
        private Long id;
        private String username;

        public UserResponse(Long id, String username) {
            this.id = id;
            this.username = username;
        }

        public Long getId() { return id; }
        public String getUsername() { return username; }
    }

    // ✅ Signup endpoint
    @PostMapping("/signup")
    public UserResponse signup(@RequestBody User user) {
        try {
            User saved = userService.registerUser(user.getUsername(), user.getPassword());
            return new UserResponse(saved.getId(), saved.getUsername());
        } catch (RuntimeException e) {
            // Example: username already exists
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    // ✅ Login endpoint
    @PostMapping("/login")
    public UserResponse login(@RequestBody User user) {
        try {
            User loggedIn = userService.loginUser(user.getUsername(), user.getPassword());
            return new UserResponse(loggedIn.getId(), loggedIn.getUsername());
        } catch (RuntimeException e) {
            // Example: invalid credentials
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }
}
