package com.example.springboot1.entities;


import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.*;


import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String username;
        @Column(unique = true)
        private String email;
        @JsonIgnore
        private String password;
        private LocalDateTime createdAt = LocalDateTime.now();
        private boolean enabled = false;

}