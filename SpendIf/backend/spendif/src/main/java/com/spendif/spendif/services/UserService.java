package com.spendif.spendif.services;

import com.spendif.spendif.models.User;
import com.spendif.spendif.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Signup
    public User registerUser(String username, String password) {
        // Check if user already exists
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already taken");
        }

        // Encrypt password
        String encodedPassword = passwordEncoder.encode(password);

        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);

        return userRepository.save(user);
    }

    // Login
    public User loginUser(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user; // Successful login
            } else {
                throw new RuntimeException("Invalid password");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
