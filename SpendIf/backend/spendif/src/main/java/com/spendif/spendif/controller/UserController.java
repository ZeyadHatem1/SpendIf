package com.spendif.spendif.controller;

import com.spendif.spendif.models.User;
import com.spendif.spendif.services.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ Signup endpoint
    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userService.registerUser(user.getUsername(), user.getPassword());
    }

    // ✅ Login endpoint
    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService.loginUser(user.getUsername(), user.getPassword());
    }
}
