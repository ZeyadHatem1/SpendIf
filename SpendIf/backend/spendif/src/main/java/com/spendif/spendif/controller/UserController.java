package com.spendif.spendif.controller;

import com.spendif.spendif.models.User;
import com.spendif.spendif.services.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // allow frontend to call backend
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ Signup endpoint
    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userService.registerUser(user.getUserName(), user.getPassword());
    }

    // ✅ Login endpoint
    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService.loginUser(user.getUserName(), user.getPassword());
    }
}
