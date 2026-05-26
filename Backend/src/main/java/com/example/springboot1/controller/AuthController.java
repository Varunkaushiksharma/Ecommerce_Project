package com.example.springboot1.controller;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
        if (userService.findByEmail(email).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Email already exists"));
        }

        User u = userService.registerUser(username, email, password, "ROLE_USER");
        return ResponseEntity.ok(Map.of("msg", "registered as USER", "email", u.getEmail()));
    }

    // 🔹 Admin registration
    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");

        User u = userService.registerUser(username, email, password, "ROLE_ADMIN");
        return ResponseEntity.ok(Map.of("msg", "registered as ADMIN", "email", u.getEmail()));
    }

    // 🔹 Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        var userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid credentials"));
        }

        var user = userOpt.get();
         if (!user.isEnabled()) {
             return ResponseEntity.status(403)
                                  .body(Map.of(
                                    "error",
                                    "Please verify your email first"
                            ));
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid credentials"));
        }
        boolean isAdmin = body.get("email").equals("admin@example.com"); // Replace with actual admin email check
        String token = jwtUtils.generateToken(user.getEmail(), isAdmin);
        return ResponseEntity.ok(Map.of("token", token, "email", user.getEmail()));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {

        if (!jwtUtils.validateJwt(token)) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Invalid token"));
        }

        String email =
                jwtUtils.getEmailFromJwt(token);

        var userOpt =
                userService.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        user.setEnabled(true);

        userService.save(user);

        return ResponseEntity.ok(
                Map.of("msg", "Email verified successfully")
        );
    }
}