package com.spendif.spendif.controller;

import com.spendif.spendif.models.User;
import com.spendif.spendif.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // allow React frontend
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // DTO to avoid sending password
    public static class UserResponse {
        private Long id;
        private String username;
        private String email;

        public UserResponse(Long id, String username, String email) {
            this.id = id;
            this.username = username;
            this.email = email;
        }

        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
    }

    // ✅ Signup endpoint
    @PostMapping("/signup")
    public UserResponse signup(@RequestBody User user) {
        try {
            User saved = userService.registerUser(user.getUsername(), user.getEmail(), user.getPassword());
            return new UserResponse(saved.getId(), saved.getUsername(), saved.getEmail());
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    // ✅ Login endpoint
    @PostMapping("/login")
    public UserResponse login(@RequestBody User user) {
        try {
            User loggedIn = userService.loginUser(user.getEmail(), user.getPassword());
            return new UserResponse(loggedIn.getId(), loggedIn.getUsername(), loggedIn.getEmail());
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }

    // ✅ Email verification endpoint
    @GetMapping("/verify")
    public String verifyUser(@RequestParam("token") String token) {
        try {
            userService.verifyUser(token);
            return "✅ Account verified successfully! You can now log in.";
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
