package com.example.springboot1.service;
import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.springboot1.entities.User;
import com.example.springboot1.repository.UserRepository;
import com.example.springboot1.security.JwtUtils;

import lombok.RequiredArgsConstructor;
import static java.util.Collections.emptyList;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {


private final UserRepository userRepository;
private final PasswordEncoder passwordEncoder;
private final EmailService emailService;
private final JwtUtils jwtUtils;


  public User registerUser(String username, String email, String rawPassword) {
        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(rawPassword));

        u.setEnabled(false);
       
        User saved = userRepository.save(u);

        String token = jwtUtils.generateToken(saved.getEmail(), "EMAIL_VERIFICATION");

        emailService.sendVerificationEmail(
                saved.getEmail(),
                token
        );

        return saved;

    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) throw new UsernameNotFoundException("User not found");
        User user = userOptional.get();
        
        return new org.springframework.security.core.userdetails.User(
            user.getEmail(), 
            user.getPassword(),
            emptyList() 
            );
    }


    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }
    public void forgotPassword(String email){
        userRepository.findByEmail(email)
                .ifPresent(user ->{
                 String token = 
                            jwtUtils.generateToken(user.getEmail(), "PASSWORD_RESET");

                 emailService
                 .sendPasswordResetEmail(
                    user.getEmail(), token
                );
            });
    }   
    public User resetPassword(String token, String newPassword) {
        if (!jwtUtils.getTokenType(token).equals("PASSWORD_RESET")) {
            throw new RuntimeException("Invalid token");
        }

        String email = jwtUtils.getEmailFromJwt(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }
}
