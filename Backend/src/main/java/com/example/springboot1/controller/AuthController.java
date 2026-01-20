package com.example.springboot1.controller;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot1.entities.User;
import com.example.springboot1.security.JwtUtils;
import com.example.springboot1.service.UserService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {


    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;


     // 🔹 Normal user registration
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");

        User u = userService.registerUser(username, email, password, "ROLE_USER");
        return ResponseEntity.ok(Map.of("msg", "registered as USER", "username", u.getUsername()));
    }

    // 🔹 Admin registration
    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");

        User u = userService.registerUser(username, email, password, "ROLE_ADMIN");
        return ResponseEntity.ok(Map.of("msg", "registered as ADMIN", "username", u.getUsername()));
    }

    // 🔹 Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        var userOpt = userService.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid credentials"));
        }

        var user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid credentials"));
        }
        boolean isAdmin = body.get("username").equals("admin");
        String token = jwtUtils.generateToken(user.getUsername(), isAdmin);
        return ResponseEntity.ok(Map.of("token", token, "username", user.getUsername()));
    }
}